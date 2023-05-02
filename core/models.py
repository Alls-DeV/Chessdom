from core import db, login_manager
from core import bcrypt
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(length=30), unique=True, nullable=False)
    email = db.Column(db.String(length=50), unique=True, nullable=False)
    password_hash = db.Column(db.String(length=60), nullable=False)

    @property
    def password(self) -> str:
        return self.password
    
    @password.setter
    def password(self, plain_text_password : str) -> None:
        self.password_hash = bcrypt.generate_password_hash(plain_text_password).decode('utf-8')

    def check_password_correction(self, attempted_password : str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, attempted_password)

    def __repr__(self) -> str:
        return f'User {self.id}\nUsername: {self.username}\nEmail: {self.email}\nPassword: {self.password_hash}\n'
    
    def __str__(self) -> str:
        return f'User {self.id}\nUsername: {self.username}\nEmail: {self.email}\nPassword: {self.password_hash}\n'

class Game(db.Model):
    __tablename__ = 'games'
    id = db.Column(db.Integer(), primary_key=True)
    id_player = db.Column(db.Integer(), db.ForeignKey('users.id'))
    color = db.Column(db.Integer())
    white = db.Column(db.String(length=30), nullable=False)    
    black = db.Column(db.String(length=30), nullable=False)
    result = db.Column(db.Integer(), nullable=False)
    moves = db.Column(db.String(length=10000), nullable=False)
    date = db.Column(db.Date())
    # 1 = white wins, -1 = black wins, 0 = draw
    white_elo = db.Column(db.Integer())
    black_elo = db.Column(db.Integer())

    def __repr__(self) -> str:
        return f'Game {self.id}\nWhite: {self.white}\nBlack: {self.black}\nResult: {self.result}\nMoves: {self.moves}\nDate: {self.date}\n'
    
    def __str__(self) -> str:
        return f'Game {self.id}\nWhite: {self.white}\nBlack: {self.black}\nResult: {self.result}\nMoves: {self.moves}\nDate: {self.date}\n'

class Friend(db.Model):
    __tablename__ = 'friends'
    id = db.Column(db.Integer(), primary_key=True)
    id_user = db.Column(db.Integer(), db.ForeignKey('users.id'))
    id_friend = db.Column(db.Integer(), db.ForeignKey('users.id'))

class Preference(db.Model):
    __tablename__ = 'preferences'
    id = db.Column(db.Integer(), primary_key=True)
    id_user = db.Column(db.Integer(), db.ForeignKey('users.id'))
    piece_set = db.Column(db.String(length=30))
    white_color = db.Column(db.String(length=30))
    black_color = db.Column(db.String(length=30))