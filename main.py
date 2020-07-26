from flask import Blueprint, render_template, request, jsonify, make_response, flash
from . import db
from .models import User, Post, Tag
from flask_login import login_required, current_user
from sqlalchemy import func, or_
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

@main.route('/main')
def main_index():
    posts_list = db.session.query(Post).join(User).filter(User.id == Post.user_id).order_by(Post.timestamp.desc()).all()
    posts = []
    full_tag_list = Tag.query.all()
    all_tags = []
    for tag in full_tag_list:
        all_tags.append({'name': tag.name, 'id': tag.id})

    for post in posts_list:
        tags_list = post.tags
        tags = []

        for tag in tags_list:
            tags.append({'name': tag.name})
        posts.append({'id': post.id, 'user_id': post.user_id, 'title': post.title, 'body': post.body, 'tags': tags, 'user': User.query.filter_by(id=post.user_id).first().name, 'time': post.timestamp.strftime('%x %H:%M')})

    data = []
    data.append(posts)
    data.append(all_tags)

    return jsonify({'data': data}), {'Access-Control-Allow-Origin': '*'}


@main.route('/search')
def search():
    title_query = func.lower(Post.title).contains(request.args.get('query').lower(), autoescape=True)
    body_query = func.lower(Post.body).contains(request.args.get('query').lower(), autoescape=True)
    posts=db.session.query(Post).filter(or_(title_query, body_query))
    return render_template('index.html', posts=posts)

@main.route('/follow/<user_id>', methods=['OPTIONS'])
@cross_origin()
def follow_options(user_id):
    response = {'hello'}
    return jsonify({'response': response}), 205

@main.route('/follow/<user_id>', methods=['POST'])
def follow(user_id):
    stuff = request.get_json(force=True)
    user = db.session.query(User).get(user_id)
    c_user = db.session.query(User).filter_by(email=stuff['user_email']).first()

    c_user.follow(user)
    db.session.commit()

    response = []
    return jsonify({'response': response}), 204

@main.route('/unfollow/<user_id>', methods=['OPTIONS'])
@cross_origin()
def unfollow_options(user_id):
    response = {'hello'}
    return jsonify({'response': response}), 205

@main.route('/unfollow/<user_id>', methods=['POST'])
def unfollow(user_id):
    stuff = request.get_json(force=True)
    user = db.session.query(User).get(user_id)
    c_user = db.session.query(User).filter_by(email=stuff['user_email']).first()

    c_user.unfollow(user)
    db.session.commit()

    response = []
    return jsonify({'response': response}), 204