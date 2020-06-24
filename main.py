from flask import Blueprint, render_template, request, jsonify, make_response, flash
from . import db
from .models import User, Post, Tag
from flask_login import login_required, current_user
from sqlalchemy import func, or_
from .decorators import crossdomain
import sys

main = Blueprint('main', __name__)

@main.route('/', methods=['GET','POST'])
def index():
    if request.method == 'POST':
        tags = request.form.getlist('tags')
        posts = db.session.query(Post).all()
        final_posts = []

        tags_list = Tag.query.all()
        tags_full = []
        for tag in tags_list:
            tags_full.append({'name': tag.name})

        if len(tags) == 0:
            return render_template('index.html', posts=posts, added_tags=tags, tags=tags_full)
        else:
            for tag in tags:
                full_tag = db.session.query(Tag).filter_by(name=tag).first()
                for post in posts:
                    if full_tag in post.tags:
                        if post not in final_posts:
                            final_posts.append(post)
                    else:
                        if post in final_posts:
                            final_posts.remove(post)

            return render_template('index.html', posts=final_posts, added_tags=tags, tags=tags_full)
    else:
        tags_list = Tag.query.all()
        tags = []

        added_tags = []
        for tag in tags_list:
            tags.append({'name': tag.name})

        posts = db.session.query(Post).join(User).filter(User.id == Post.user_id).order_by(Post.timestamp.desc()).all()
        return render_template('index.html', posts=posts, tags=tags, added_tags=added_tags)


@main.route('/search')
def search():
    tags_list = Tag.query.all()
    tags = []
    added_tags = []
    for tag in tags_list:
        tags.append({'name': tag.name})

    title_query = func.lower(Post.title).contains(request.args.get('query').lower(), autoescape=True)
    body_query = func.lower(Post.body).contains(request.args.get('query').lower(), autoescape=True)
    posts=db.session.query(Post).filter(or_(title_query, body_query))
    return render_template('index.html', tags=tags, posts=posts, added_tags=added_tags)


@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, points=current_user.points)
