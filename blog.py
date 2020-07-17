from flask import Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
from flask_login import login_required, current_user
from werkzeug.exceptions import abort
from flask_cors import cross_origin, CORS
from .models import User, Post, Comment
from . import db

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
    user_id = User.query.filter_by(email=postData['user']).first().id

    new_post = Post(title=title, body=body, user_id=user_id)
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
        return redirect(url_for('main.index'))

    tags_list = post[0].tags
    tags = []
    comm = []

    for tag in tags_list:
        tags.append({'name': tag.name})

    for comment in comments:
        comm.append({'comment': comment.text, 'commentor': comment.user.name, 'comment_id': comment.id})
    
    json_post = {'id': post[0].id, 'title': post[0].title, 'body': post[0].body, 'tags': tags, 'comments': comm}

    return jsonify({'json_post': json_post})

@bp.route('/posts/<int:post_id>/update', methods=['GET', 'POST'])
@cross_origin()
@login_required
def update(post_id):
    result = get_post(post_id)

    if result[1] != None:
        flash(result[1])
        return redirect(url_for('main.index'))

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
        return redirect(url_for('main.index'))

    return render_template('blog/update.html', post=result[0])

@bp.route('/posts/<int:post_id>/delete', methods=['POST'])
@login_required
def delete(post_id):
    post = db.session.query(Post).get(post_id)
    db.session.delete(post)
    db.session.commit()

    flash("Your post has been deleted.")
    return redirect(url_for('main.index'))

@bp.route('/posts/<int:post_id>/comment', methods=['POST'])
def comment(post_id): 
    comment = request.get_json(force=True)
    
    new_comment = Comment(text=comment, user_id=current_user.id, post_id=post_id)
    new_comment.save()
    response = []
    return jsonify({'response': response}), 204

@bp.route('/posts/<int:post_id>/category/<module>', methods=['GET'])
@login_required
def category(module, post_id):
    post = db.session.query(Post).get(post_id)
    post.module = db.session.query(Module).filter_by(code=module).first()
    db.session.commit()

    flash("Your post is now under module " + module)
    return redirect(url_for('main.index'))

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
