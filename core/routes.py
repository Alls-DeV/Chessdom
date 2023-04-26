import os
import chess

from core import app
from flask import render_template, redirect, send_from_directory, url_for, flash, request
from core import db
from core.models import User, Game
from core.forms import RegisterForm, LoginForm, SearchForm, GameForm
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename

@app.route('/')
@app.route('/home')
def home_page():
    return render_template('home.html')

@app.route('/editor')
def editor_page():
    return render_template('editor.html')
    
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
        attempted_user = User.query.filter_by(username=form.username.data).first()
        if attempted_user and attempted_user.check_password_correction(attempted_password=form.password.data):
            login_user(attempted_user)
            flash(f'Success! You are logged in as {attempted_user.username}', category='success')
            return redirect(url_for('home_page'))
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
    if not User.query.filter_by(username=username).first():
        flash('User not found!', category='danger')
        return redirect(url_for('home_page'))
    editable = current_user.is_authenticated and current_user.username == username
    games = Game.query.filter_by(id_player=User.query.filter_by(username=username).first().id).all()
    return render_template('profile.html', username=username, editable=editable, games=games)

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
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            with open(os.path.join(app.config['UPLOAD_FOLDER'], filename), 'r') as f:
                # read the file
                content = f.read()
            # remove file
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))

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