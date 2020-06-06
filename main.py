from flask import Blueprint, render_template, request
from . import db
from .models import User, Post
from flask_login import login_required, current_user

main = Blueprint('main', __name__)

@main.route('/')
def index():
    posts = db.session.query(Post).join(User).filter(User.id == Post.user_id).all()
    return render_template('index.html', posts=posts)

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)
