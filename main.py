from flask import Blueprint, render_template, request, jsonify, make_response, flash
from . import db
from .models import User, Post, Tag
from flask_login import login_required, current_user
from sqlalchemy import func, or_
from .decorators import crossdomain
import sys

main = Blueprint('main', __name__)

@main.route('/')
def index():
    tags_list = Tag.query.all()
    tags = []

    for tag in tags_list:
        tags.append({'name': tag.name})

    posts = db.session.query(Post).join(User).filter(User.id == Post.user_id).order_by(Post.timestamp.desc()).all()
    return render_template('index.html', posts=posts, tags=tags)


@main.route('/search')
def search():
    title_query = func.lower(Post.title).contains(request.args.get('query').lower(), autoescape=True)
    body_query = func.lower(Post.body).contains(request.args.get('query').lower(), autoescape=True)
    posts=db.session.query(Post).filter(or_(title_query, body_query))
    return render_template('index.html', posts=posts)

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, points=current_user.points)
