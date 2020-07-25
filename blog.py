from flask import Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
from flask_login import login_required, current_user
from sqlalchemy import and_
from werkzeug.exceptions import abort
from flask_cors import cross_origin, CORS
from models import User, Post, Comment, Tag
from app import db

bp = Blueprint('blog', __name__)

CORS(bp)

@bp.route('/create', methods=['OPTIONS'])
@cross_origin()
def create_options():
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/create', methods=['POST'])
@cross_origin()
def create():
    postData = request.get_json(force=True)
    title = postData['title']
    body = postData['body']
    tags = postData['tags']
    
    if postData['newTags'] is None:
        newTags = []
    else:
        newTags = postData['newTags']

    user_id = User.query.filter_by(email=postData['user']).first().id

    new_post = Post(title=title, body=body, user_id=user_id)

    new_post.tags = []

    for newTag in newTags:
        new_tag = Tag(name=newTag)
        db.session.add(new_tag)
    
    db.session.commit()

    for tag in tags:
        curr_tag = db.session.query(Tag).filter_by(name=tag).first()
        new_post.tags.append(curr_tag)

    db.session.add(new_post)
    db.session.commit()
    response = []
    return jsonify({'response': response}), 204

def get_post(post_id, check_author=True):
    post = Post.query.get(post_id)
    string = None

    # Make sure post exists.
    if post is None:
        string = "Post does not exist. Please try again."

    # Checking if post user and current user is the same
    if check_author and post.user_id != current_user.id:
        string = "You are not allowed to edit this post."

    return post,string

def get_comments(post_id):
    comments = db.session.query(Comment).filter_by(post_id=post_id).order_by(Comment.path.asc(), Comment.timestamp.desc()).all()
    return comments

@bp.route('/posts/<int:post_id>')
def indiv_post(post_id):
    post = get_post(post_id, False)
    comments = get_comments(post_id)

    if post[1] != None:
        flash(post[1])
        return redirect(url_for('main.main_index'))

    tags_list = post[0].tags
    tags = []
    comm = []

    for tag in tags_list:
        tags.append({'name': tag.name})

    for comment in comments:
        comm.append({'text': comment.text, 'commentor': comment.user.name, 'user_email': comment.user.email, 'comment_id': comment.id, 'comment_level': comment.level(), 'time': comment.timestamp})

    json_post = {'id': post[0].id, 
        'user_id': post[0].user.id, 
        'username': post[0].user.name,
        'time': post[0].timestamp.strftime('%x %H:%M'), 
        'user_email': post[0].user.email, 
        'title': post[0].title, 
        'body': post[0].body, 
        'tags': tags, 
        'comments': comm
        }

    return jsonify({'json_post': json_post})

@bp.route('/posts/<int:post_id>/update', methods=['OPTIONS'])
@cross_origin()
def update_options(post_id):
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/posts/<int:post_id>/update', methods=['GET', 'POST'])
@cross_origin()
def update(post_id):
    post = get_post(post_id, False)
    json_post = {'id': post[0].id, 'title': post[0].title, 'body': post[0].body}

    if request.method == 'POST':
        postData = request.get_json(force=True)
        title = postData['title']
        body = postData['body']
        user_id = User.query.filter_by(email=postData['user']).first().id

        new_post = db.session.query(Post).get(post_id)
        new_post.title = title
        new_post.body = body
        db.session.commit()
        response = []
        return jsonify({'response': response}), 204

    return jsonify({'json_post': json_post}), 206

@bp.route('/posts/<int:post_id>/delete', methods=['OPTIONS'])
@cross_origin()
def delete_options(post_id):
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/posts/<int:post_id>/delete', methods=['POST'])
@cross_origin()
def delete(post_id):
    post = db.session.query(Post).get(post_id)
    db.session.delete(post)
    db.session.commit()

    response = []
    return jsonify({'response': response}), 204

@bp.route('/posts/<int:post_id>/comment', methods=['OPTIONS'])
@cross_origin()
def comment_options():
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/posts/<int:post_id>/comment', methods=['POST'])
@cross_origin()
def comment(post_id):
    comment = request.get_json(force=True)
    text = comment['text']
    user_id = User.query.filter_by(email=comment['user_email']).first().id
    post_id = comment['post_id']
    new_comment = Comment(text=text, user_id=user_id, post_id=post_id)
    new_comment.save()

    return redirect(url_for('blog.indiv_post', post_id=post_id))

@bp.route('/posts/<int:post_id>/<int:comment_id>/reply', methods=['OPTIONS'])
@cross_origin()
def reply_options(): 
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/posts/<int:post_id>/<int:comment_id>/reply', methods=['POST'])
@cross_origin()
def reply(post_id, comment_id): 
    reply = request.get_json(force=True)
    text=reply['text']
    user_id = User.query.filter_by(email=reply['user_email']).first().id
    post_id = reply['post_id']
    parent_id = reply['parent_id']
    parent = Comment.query.get(parent_id)
    new_comment = Comment(text=text, user_id=user_id, post_id=post_id, parent=parent)
    new_comment.save()

    response = []
    return jsonify({'response': response}), 204

@bp.route('/posts/<int:post_id>/<int:comment_id>/delete', methods=['OPTIONS'])
@cross_origin()
def delete_comment_options(post_id, comment_id):
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/posts/<int:post_id>/<int:comment_id>/delete', methods=['POST'])
@cross_origin()
def delete_comment(post_id, comment_id):
    comment = db.session.query(Comment).get(comment_id)
    comment.user_id = 46
    comment.text = "This comment has been deleted."
    db.session.commit()

    response = []
    return jsonify({'response': response}), 204

@bp.route('/posts/<int:post_id>/category/<module>', methods=['GET'])
@login_required
def category(module, post_id):
    post = db.session.query(Post).get(post_id)
    post.module = db.session.query(Module).filter_by(code=module).first()
    db.session.commit()

    flash("Your post is now under module " + module)
    return redirect(url_for('main.main_index'))

@bp.route('/add_module', methods=['POST'])
def add_module():
    module_data = request.get_json()

    new_module = Module(name=module_data['name'], code=module_data['code'])

    db.session.add(new_module)
    db.session.commit()

    return 'Done', 201

@bp.route('/modules')
def modules():
    modules_list = Module.query.all()
    modules = []

    for module in modules_list:
        modules.append({'name': module.name, 'code': module.code})

    return jsonify({'modules' : modules})