from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://alls:professore@localhost/chessdom'
app.config['SECRET_KEY'] = '9d73e8d3fd1a92e4265b3bf0'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
from core import routes

'''
TODO
non far fare alla stessa persona piu' volte lo stesso problema
fare una classifica dei problemi risolti
mettere tra le possibilita' di skippare il problema
avere un count degli errori e degli skip
add the possibility to change the password
'''