import os
import chess
import random

from core import app
from flask import render_template, redirect, send_from_directory, url_for, flash, request
from core import db
from core.models import User, Game, Friend, Preference, Puzzle, PuzzleAttempted, PuzzleStats
from core.forms import RegisterForm, LoginForm, SearchForm, GameForm, EditorForm, PreferenceForm, PuzzleForm
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from datetime import datetime

DEFAULT_PIECE_SET = 'alpha'
DEFAULT_WHITE_COLOR = '#f0d9b5'
DEFAULT_BLACK_COLOR = '#b58863'

def get_preferences():
    piece_set = DEFAULT_PIECE_SET
    white_color = DEFAULT_WHITE_COLOR
    black_color = DEFAULT_BLACK_COLOR
    if current_user.is_authenticated:
        preference = Preference.query.filter_by(id_user=current_user.id).first()
        if preference:
            piece_set = preference.piece_set if preference.piece_set else DEFAULT_PIECE_SET
            white_color = preference.white_color if preference.white_color else DEFAULT_WHITE_COLOR
            black_color = preference.black_color if preference.black_color else DEFAULT_BLACK_COLOR
    return piece_set, white_color, black_color

@app.before_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        current_user.last_seen = current_user.last_seen.replace(hour=(current_user.last_seen.hour + 2) % 24)
        db.session.commit()

@app.route('/', methods=['GET', 'POST'])
@app.route('/home', methods=['GET', 'POST'])
def home_page():
    if current_user.is_authenticated:
        # if PuzzleStats has not the current user, create it
        if not PuzzleStats.query.filter_by(id_user=current_user.id).first():
            puzzle_stats = PuzzleStats(id_user=current_user.id)
            db.session.add(puzzle_stats)
        else:
            puzzle_stats = PuzzleStats.query.filter_by(id_user=current_user.id).first()

    piece_set, white_color, black_color = get_preferences()
    if current_user.is_authenticated:
        # Define the elo range for the current user
        elo_min = puzzle_stats.elo - 200
        elo_max = puzzle_stats.elo + 200

        # Query for puzzles within the elo range that the current user has not attempted
        puzzles_attempted = db.session.query(PuzzleAttempted.id_puzzle).filter_by(id_user=current_user.id)
        puzzles_unattempted = Puzzle.query.filter(Puzzle.rating.between(elo_min, elo_max)).filter(~Puzzle.id.in_(puzzles_attempted))

        # Choose a random unattempted puzzle
        puzzle = puzzles_unattempted.offset(int(puzzles_unattempted.count() * random.random())).first()

    else:
        puzzle = Puzzle.query.filter_by(id=random.randint(0, Puzzle.query.count())).first()
    fen_list = []
    check_list = []
    color = 'white' if puzzle.FEN.split(' ')[1] == 'w' else 'black'
    board = chess.Board(fen=puzzle.FEN)
    fen_list.append(board.fen())
    check_list.append(board.is_check())
    for move in puzzle.moves.split(' '):
        if move[-1] == '.':
            continue
        board.push_san(move)
        fen_list.append(board.fen())
        check_list.append(board.is_check())

    if current_user.is_authenticated:
        K = 40 if puzzle_stats.attempted <= 10 else 10
        delta_elo = abs(int(K * (- 1 / (1 + 10 ** ((puzzle_stats.elo - puzzle.rating) / 400)))))
    else:
        delta_elo = 0

    form = PuzzleForm()
    
    if current_user.is_authenticated and form.validate_on_submit():
        result = form.result.data
        puzzle_attempted = PuzzleAttempted(id_user=current_user.id, id_puzzle=puzzle.id, result=result)
        puzzle_stats.attempted += 1

        print(delta_elo)
        if result == 1:
            puzzle_stats.solved += 1
            puzzle_stats.elo += delta_elo
        elif result == -1:
            puzzle_stats.elo -= delta_elo
        
        db.session.add(puzzle_attempted)
        db.session.commit()

    
    return render_template('home.html', piece_set=piece_set, white_color=white_color, black_color=black_color, fen_list=fen_list, check_list=check_list, rating=puzzle.rating, opening=puzzle.opening, themes=puzzle.themes, color=color, form=form, delta_elo=delta_elo)

@app.route('/editor')
def editor_page():
    piece_set, white_color, black_color = get_preferences()
    return render_template('editor.html', form=EditorForm(), piece_set=piece_set, white_color=white_color, black_color=black_color)
    
@app.route('/register', methods=['GET', 'POST'])
def register_page():
    form = RegisterForm()
    if form.validate_on_submit():
        user_to_create = User(
            username=form.username.data,
            email=form.email.data,
            password=form.password.data
        )
        db.session.add(user_to_create)
        db.session.commit()
        login_user(user_to_create)
        flash(f'Success! You are registered and logged in as {user_to_create.username}', category='success')
        return redirect(url_for('home_page'))
    if form.errors != {}:
        for err_msg in form.errors.values():
            flash(err_msg[0], category='danger')
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    form = LoginForm()
    if form.validate_on_submit():
        if '@' in form.username.data:
            attempted_user = User.query.filter_by(email=form.username.data).first()
        else:
            attempted_user = User.query.filter_by(username=form.username.data).first()
        if attempted_user and attempted_user.check_password_correction(attempted_password=form.password.data):
            login_user(attempted_user)
            flash(f'Success! You are logged in as {attempted_user.username}', category='success')
            return redirect(url_for('home_page'))
        else:
            if '@' in form.username.data:
                flash('Email and password are not match! Please try again', category='danger')
            else:
                flash('Username and password are not match! Please try again', category='danger')
    return render_template('login.html', form=form)

@app.route('/logout')
def logout_page():
    logout_user()
    flash('You have been logged out!', category='info')
    return redirect(url_for('home_page'))

@app.route('/search', methods=['GET', 'POST'])
def search_page():
    form = SearchForm()
    users = None
    if form.validate_on_submit():
        if '@' in form.search.data:
            pref = form.search.data.split('@')[0]
            suff = form.search.data.split('@')[1]
            # search all the users that has for the form.search.data as subsequences
            users = User.query.filter(User.username.like('%' + pref + '%'), User.email.like('%' + suff + '%'))
        else:
            # search all the users that has for the form.search.data as subsequences
            users = User.query.filter(User.username.like('%' + form.search.data + '%'))
    return render_template('search.html', form=form, users=users)

@app.route('/profile/<username>')
def profile_page(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        flash('User not found!', category='danger')
        return redirect(url_for('home_page'))
    editable = current_user.is_authenticated and current_user.username == username
    games = Game.query.filter_by(id_player=user.id).all()
    is_friend = False
    if current_user.is_authenticated:
        is_friend = Friend.query.filter_by(id_user=current_user.id, id_friend=user.id).first()
    # TODO risolvi boh qualcosa
    number_followers = Friend.query.filter_by(id_friend=user.id).count()
    # print(f'people that follow {user.username}: {number_followers}')
    number_following = Friend.query.filter_by(id_user=current_user.id).count()

    puzzle_stats = PuzzleStats.query.filter_by(id_user=user.id).first()
    if puzzle_stats is None:
        puzzle_stats = PuzzleStats(id_user=current_user.id)
        db.session.add(puzzle_stats)
        db.session.commit()
    elo = puzzle_stats.elo 
    solved = puzzle_stats.solved
    attempted = puzzle_stats.attempted

    return render_template('profile.html', user=user, editable=editable, games=games, is_friend=is_friend, number_followers=number_followers, number_following=number_following, elo=elo, solved=solved, attempted=attempted)

@login_required
@app.route('/friend/<username>')
def friend_page(username):
    if not User.query.filter_by(username=username).first():
        flash('User not found!', category='danger')
        return redirect(url_for('home_page'))
    if not current_user.is_authenticated or current_user.username != username:
        flash('You are not allowed to see this page!', category='danger')
        return redirect(url_for('home_page'))
    friends = Friend.query.filter_by(id_user=current_user.id).all()
    users = []
    for friend in friends:
        # user, winrate, number of games
        # the game won are the games where color is equal to result
        games = Game.query.filter_by(id_player=friend.id_friend).all()
        won = 0
        for game in games:
            if game.color == game.result:
                won += 1
        if len(games) != 0:
            users.append((User.query.filter_by(id=friend.id_friend).first(), str(won / len(games)) + "%", len(games)))
        else:
            users.append((User.query.filter_by(id=friend.id_friend).first(), "?", 0))

    return render_template('friend.html', username=username, users=users)

@login_required
@app.route('/add_friend/<username>', methods=['GET', 'POST'])
def add_friend_page(username):
    if not User.query.filter_by(username=username).first():
        flash('User not found!', category='danger')
        return redirect(url_for('home_page'))
    friend = Friend(
        id_user=current_user.id,
        id_friend=User.query.filter_by(username=username).first().id
    )
    db.session.add(friend)
    db.session.commit()
    flash('Friend added!', category='success')
    # profile page of the user
    return redirect(url_for('profile_page', username=username))

@login_required
@app.route('/remove_friend/<username>', methods=['GET', 'POST'])
def remove_friend_page(username):
    if not User.query.filter_by(username=username).first():
        flash('User not found!', category='danger')
        return redirect(url_for('home_page'))
    friend = Friend.query.filter_by(id_user=current_user.id, id_friend=User.query.filter_by(username=username).first().id).first()
    db.session.delete(friend)
    db.session.commit()
    flash('Friend removed!', category='success')
    return redirect(url_for('profile_page', username=username))

def validate_moves(moves):
    if moves == '':
        return True
    try:
        board = chess.Board()
        for move in moves.split(' '):
            # if move is the number of the move
            if move[-1] == '.' and move[:-1].isdigit():
                continue
            board.push_san(move)
        return True
    except:
        return False

@login_required
@app.route('/import', methods=['GET', 'POST'])
def import_page():
    form = GameForm()
    add = False

    if form.validate_on_submit():
        file = form.file.data
        
        if file:
            filename = secure_filename(file.filename)
            
            # save the file
            file.save(os.path.join(filename))
            with open(os.path.join(filename), 'r') as f:
                # read the file
                content = f.read()
            # remove file
            os.remove(os.path.join(filename))

            # split the file into lines
            lines = content.splitlines()

            # get the moves
            for index in range(len(lines)):
                if lines[index] == '':
                    moves = lines[index+1:]
                    lines = lines[:index]
                    break

            # managing moves
            # lichess
            if len(moves) == 3 and moves[1] == '' and moves[2] == '':
                moves = moves[0]
            # chess.com
            else:
                moves = ' '.join(moves)

            # removing the result
            if moves.rfind(' ') == -1:
                moves = ''                
            else:
                moves = moves[:moves.rfind(' ')]

            mapp = {}
            for index in range(len(lines)):
                lines[index] = lines[index][1:-1]
                mapp[lines[index][:lines[index].find(' ')]] = lines[index][lines[index].find(' ')+2:-1]
            
            if mapp['Result'] == '1-0':
                mapp['Result'] = 1
            elif mapp['Result'] == '0-1':
                mapp['Result'] = -1
            else:
                mapp['Result'] = 0

            game_to_create = Game(
                id_player=current_user.id,
                white=mapp['White'],
                black=mapp['Black'],
                result=mapp['Result'],
                date=mapp['Date'].replace('.', '-'),
                white_elo=mapp['WhiteElo'],
                black_elo=mapp['BlackElo'],
                moves=moves
            )
            add = True
        
        if form.white.data and form.black.data and form.moves.data:
            game_to_create = Game(
                id_player=current_user.id,
                white=form.white.data,
                black=form.black.data,
                result=form.result.data,
                date=form.date.data,
                white_elo=form.white_elo.data,
                black_elo=form.black_elo.data,
                moves=form.moves.data
            )
            add = True

        if add:
            if validate_moves(game_to_create.moves):
                db.session.add(game_to_create)
                db.session.commit()

                flash(f'Success! You have imported a game', category='success')
                return redirect(url_for('import_page'))
            else:
                form.file.errors.append('Invalid moves')

        else:
            form.white.errors.append('This field is required')
            form.black.errors.append('This field is required')
            form.moves.errors.append('This field is required')
            form.file.errors.append('You must insert a file or fill the fields above')

    return render_template('import.html', form=form)

@app.route('/game/<id>')
def game_page(id):
    if not Game.query.filter_by(id=id).first():
        flash('Game not found!', category='danger')
        return redirect(url_for('home_page'))
    game = Game.query.filter_by(id=id).first()
    fen_list = []
    check_list = []
    board = chess.Board()
    fen_list.append(board.fen())
    check_list.append(board.is_check())
    for move in game.moves.split(' '):
        if move[-1] == '.' and move[:-1].isdigit():
            continue
        board.push_san(move)
        fen_list.append(board.fen())
        check_list.append(board.is_check())
    piece_set, white_color, black_color = get_preferences()
    return render_template('game.html', game=game, fen_list=fen_list, check_list=check_list, piece_set=piece_set, white_color=white_color, black_color=black_color)

@login_required
@app.route('/remove_game/<id>', methods=['GET', 'POST'])
def remove_game_page(id):
    if not Game.query.filter_by(id=id).first():
        flash('Game not found!', category='danger')
        return redirect(url_for('home_page'))
    game = Game.query.filter_by(id=id).first()
    if current_user.id != game.id_player:
        flash('You can\'t delete this game!', category='danger')
        return redirect(url_for('home_page'))
    db.session.delete(game)
    db.session.commit()
    flash('Success! You have deleted a game', category='success')
    return redirect(url_for('profile_page', username=current_user.username))

@login_required
@app.route('/preference/<username>', methods=['GET', 'POST'])
def preference_page(username):
    if current_user.username != username:
        flash('You can\'t access this page!', category='danger')
        return redirect(url_for('home_page'))

    form = PreferenceForm()
    user = User.query.filter_by(username=username).first()

    piece_set, white_color, black_color = get_preferences()
    form.piece_set.default = piece_set
    form.about_me.default = user.about_me

    if form.validate_on_submit():
        # if preference already exists update it
        preference = Preference.query.filter_by(id_user=current_user.id).first()
        if preference:
            preference.piece_set = form.piece_set.data
            preference.white_color = form.white_color.data
            preference.black_color = form.black_color.data
        else:
            preference_to_create = Preference(
                id_user=current_user.id,
                piece_set=form.piece_set.data,
                white_color=form.white_color.data,
                black_color=form.black_color.data
            )
            db.session.add(preference_to_create)

        user.about_me = form.about_me.data

        db.session.commit()

        flash('Success! You have changed your preferences', category='success')
        return redirect(url_for('preference_page', username=username))

    return render_template('preference.html', form=form, piece_set=piece_set, white_color=white_color, black_color=black_color)

@app.route('/leaderboard')
def leaderboard_page():
    users_stats = PuzzleStats.query.order_by(PuzzleStats.elo.desc()).all()
    users = []
    for user_stats in users_stats:
        users.append(User.query.filter_by(id=user_stats.id_user).first())
    return render_template('leaderboard.html', users_stats=users_stats, users=users, size=len(users_stats))