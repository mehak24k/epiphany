from flask import Blueprint, render_template, request, jsonify, make_response, flash
from . import db
from .models import User, Post
from flask_login import login_required, current_user
from sqlalchemy import func, or_
from .decorators import crossdomain
import sys
from flask_cors import cross_origin, CORS

main = Blueprint('main', __name__)
CORS(main)


def build_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def build_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@main.route('/')
def index():
    posts_list = Post.query.all()
    posts = []

    for post in posts_list:
        posts.append({'id': post.id, 'title': post.title, 'body': post.body})

    return jsonify({'posts': posts}), {'Access-Control-Allow-Origin': '*'}


@main.route('/search')
def search():
    #title_query = func.lower(Post.title).contains(request.args.get('query').lower(), autoescape=True)
    #body_query = func.lower(Post.body).contains(request.args.get('query').lower(), autoescape=True)
    #posts=db.session.query(Post).filter(or_(title_query, body_query))
    #return render_template('index.html', posts=posts)
    if current_user.is_authenticated:
        return {'logged_in': 'true'}
    else:
        return {'logged_in': 'false'}

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, points=current_user.points)
