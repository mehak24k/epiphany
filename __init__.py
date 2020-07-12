from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import *
from flask_login import LoginManager
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_cors import CORS

# Configure app
app = Flask(__name__, static_folder='./build', static_url_path='/')
#CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app)
#app.config['CORS_HEADERS'] = 'Content-Type'
#api = Api(app)

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.after_request
def after_request(response):
  #response.headers.add('Access-Control-Allow-Origin', '*')
  #response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  #response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

# Configure database
app.config['SECRET_KEY'] = '9OLWxND4o83j4K4iuopO'
app.config['SQLALCHEMY_DATABASE_URI']='postgres://xtpgjbaiezwjjt:9794c81f9add840240fa3ad9740a67b1998d025e85f0d9577981dd9641807b39@ec2-54-236-169-55.compute-1.amazonaws.com:5432/d51r9vlkgad9hm'
# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy(app)

db.init_app(app)

# Configuring email settings
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
app.config.from_pyfile('config.cfg')
mail = Mail(app)

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return User.query.get(int(user_id))

# blueprint for auth routes in our app
from auth import auth as auth_blueprint
app.register_blueprint(auth_blueprint)

# blueprint for non-auth parts of app
from main import main as main_blueprint
app.register_blueprint(main_blueprint)

# blueprint for posting
from blog import bp as blog_blueprint
app.register_blueprint(blog_blueprint)
