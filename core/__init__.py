from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

app = Flask(__name__)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://alls:professore@localhost:5432/chessdom'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://alls:professore@localhost/chessdom'
app.config['SECRET_KEY'] = '9d73e8d3fd1a92e4265b3bf0'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
UPLOAD_FOLDER = 'static/games'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
from core import routes