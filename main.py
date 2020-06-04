from flask import Blueprint, render_template, request
from . import db
from .models import User, Post
from flask_login import login_required, current_user

main = Blueprint('main', __name__)

@main.route('/')
def index():
    posts = Post.query.join(User).order_by(Post.timestamp.desc()).all()
    return render_template('index.html', posts=posts)

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)
