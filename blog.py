from flask import Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
from flask_login import login_required, current_user
from sqlalchemy import and_
from werkzeug.exceptions import abort
from flask_cors import cross_origin, CORS
from .models import User, Post, Comment, Tag
from . import db, app
import os
from werkzeug.utils import secure_filename

bp = Blueprint('blog', __name__)

CORS(bp)

UPLOAD_FOLDER = '/Users/Mehak/Desktop/epiphany/static'
ALLOWED_EXTENSIONS = {'mp4'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
        comm.append({'text': comment.text, 'commentor': comment.user.name, 'comment_id': comment.id, 'comment_level': comment.level(), 'time': comment.timestamp})

    json_post = {'id': post[0].id, 'user_email': post[0].user.email, 'title': post[0].title, 'body': post[0].body, 'tags': tags, 'comments': comm}

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

    return jsonify({'json_post': json_post})

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
def comment(post_id):
    comment = request.get_json(force=True)
    text = comment['text']
    user_id = User.query.filter_by(email=comment['user_email']).first().id
    post_id = comment['post_id']
    new_comment = Comment(text=text, user_id=user_id, post_id=post_id)
    new_comment.save()

    return redirect(url_for('blog.indiv_post', post_id=post_id))

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


@bp.route('/upload', methods=['OPTIONS'])
@cross_origin()
def upload_options():
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/upload', methods=['POST'])
@cross_origin()
def upload():
    #postData = request.get_json(force=True)
    title = request.form.get('title')
    file = request.files['video']
    tags = request.form.getlist('tags[]')
    file_name = request.form.get('filename')
    file_type = request.form.get('fileType')
    if request.form.getlist('newTags[]') is None:
        newTags = []
    else:
        newTags = request.form.getlist('newTags[]')
        #newTags = []

    user_id = User.query.filter_by(email=request.form.get('user')).first().id

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        body = filename
        #response = []
        #return jsonify({'response': response}), 206
    else:
        response = []
        return jsonify({'response': response}), 400

    new_post = Post(title=title, body=body, user_id=user_id, is_file=True)
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
