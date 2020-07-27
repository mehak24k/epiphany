from flask import Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
from flask_login import login_required, current_user
from sqlalchemy import and_
from werkzeug.exceptions import abort
from flask_cors import cross_origin, CORS
from models import User, Post, Comment, Tag, LikedPost, DislikedPost, LikedComment, DislikedComment
from app import db, app
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

@bp.route('/posts/<int:post_id>', methods=['GET', 'POST'])
def indiv_post(post_id):
    if request.method == 'POST':
        user_data = request.get_json(force=True)
        user_email = user_data['email']
        user = User.query.filter_by(email=user_email).first()
        post = Post.query.filter_by(id=post_id).first()
        liked_post = LikedPost.query.filter_by(post_id=post.id).first()
        disliked_post = DislikedPost.query.filter_by(post_id=post.id).first()
        liked = False
        disliked = False
        if liked_post is not None and liked_post in user.liked_posts:
            liked = True
        if disliked_post is not None and disliked_post in user.disliked_posts:
            disliked = True

        data = []
        data.append({'liked': liked, 'disliked': disliked})

        post = get_post(post_id, False)
        #comments = get_comments(post_id)
        comments = Comment.query.filter_by(post_id=post_id).all()

        tags_list = post[0].tags
        tags = []
        comm = []

        for tag in tags_list:
            tags.append({'name': tag.name})

        for comment in comments:
            liked_comment = LikedComment.query.filter_by(comment_id=comment.id).first()
            disliked_comment = DislikedComment.query.filter_by(comment_id=comment.id).first()
            if liked_comment is not None and liked_comment in user.liked_comments:
                comm.append({'text': comment.text, 'commentor': comment.user.name,
                'user_email': comment.user.email, 'comment_id': comment.id,
                'comment_level': comment.level(), 'time': comment.timestamp,
                'comment_upvotes': comment.net_upvotes, 'liked': True, 'disliked': False})
            elif disliked_comment is not None and disliked_comment in user.disliked_comments:
                comm.append({'text': comment.text, 'commentor': comment.user.name,
                'user_email': comment.user.email, 'comment_id': comment.id,
                'comment_level': comment.level(), 'time': comment.timestamp,
                'comment_upvotes': comment.net_upvotes, 'liked': False, 'disliked': True})
            else:
                comm.append({'text': comment.text, 'commentor': comment.user.name,
                'user_email': comment.user.email, 'comment_id': comment.id,
                'comment_level': comment.level(), 'time': comment.timestamp,
                'comment_upvotes': comment.net_upvotes, 'liked': False, 'disliked': False})

        json_post = {'id': post[0].id,
            'user_id': post[0].user.id,
            'username': post[0].user.name,
            'time': post[0].timestamp.strftime('%x %H:%M'),
            'user_email': post[0].user.email,
            'title': post[0].title,
            'body': post[0].body,
            'tags': tags,
            'comments': comm,
            'upvotes': post[0].net_upvotes,
            'is_file': post[0].is_file,
            }

        return jsonify({'json_post': json_post}, {'data': data})

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
        comm.append({'text': comment.text, 'commentor': comment.user.name,
        'user_email': comment.user.email, 'comment_id': comment.id,
        'comment_level': comment.level(), 'time': comment.timestamp,
        'comment_upvotes': comment.net_upvotes})

    json_post = {'id': post[0].id,
        'user_id': post[0].user.id,
        'username': post[0].user.name,
        'time': post[0].timestamp.strftime('%x %H:%M'),
        'user_email': post[0].user.email,
        'title': post[0].title,
        'body': post[0].body,
        'tags': tags,
        'comments': comm,
        'upvotes': post[0].net_upvotes,
        'is_file': post[0].is_file,
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

@bp.route('/posts/<int:post_id>/<int:comment_id>/upvote', methods=['OPTIONS'])
@cross_origin()
def upvote_comment_options():
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/posts/<int:post_id>/<int:comment_id>/upvote', methods=['POST'])
@cross_origin()
def upvote_comment(post_id, comment_id):
    upvote_data = request.get_json(force=True)
    # gets the user casting the upvote
    user = User.query.filter_by(email=upvote_data['user_email']).first()
    # gets the comment
    comment = Comment.query.filter_by(id=comment_id).first()
    # gets the user casting the upvote
    curr_user = db.session.query(User).get(user.id)
    # gets the user who commented the comment to be upvoted
    comment_user = db.session.query(User).get(user.id)

    if LikedComment.query.filter_by(comment_id=comment.id).first() is None:
        liked_comment = LikedComment(comment_id=comment.id)
        db.session.add(liked_comment)
        curr_user.liked_comments.append(liked_comment)
        curr_comment = db.session.query(Comment).get(comment_id)
        curr_comment.net_upvotes = curr_comment.net_upvotes + 1
        comment_user.points = comment_user.points + 10
        db.session.commit()

        response = []
        return jsonify({'response': response}), 200
    else:
        liked_comment = LikedComment.query.filter_by(comment_id=comment.id).first()

    if liked_comment in user.liked_comments:
        liked_comment = db.session.query(LikedComment).get(liked_comment.id)
        curr_user.liked_comments.remove(liked_comment)
        curr_comment = db.session.query(Comment).get(comment_id)
        curr_comment.net_upvotes = curr_comment.net_upvotes - 1
        comment_user.points = comment_user.points - 10
        db.session.commit()
        response = []
        return jsonify({'response': response}), 204
    else:
        liked_comment = db.session.query(LikedComment).get(liked_comment.id)
        curr_user.liked_comments.append(liked_comment)
        curr_comment = db.session.query(Comment).get(comment_id)
        curr_comment.net_upvotes = curr_comment.net_upvotes + 1
        comment_user.points = comment_user.points + 10
        db.session.commit()

        response = []
        return jsonify({'response': response}), 200

@bp.route('/posts/<int:post_id>/<int:comment_id>/downvote', methods=['OPTIONS'])
@cross_origin()
def downvote_comment_options():
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/posts/<int:post_id>/<int:comment_id>/downvote', methods=['POST'])
@cross_origin()
def downvote_comment(post_id, comment_id):
    upvote_data = request.get_json(force=True)
    # gets the user casting the downvote
    user = User.query.filter_by(email=upvote_data['user_email']).first()
    # gets the comment
    comment = Comment.query.filter_by(id=comment_id).first()
    # gets the user casting the downvote
    curr_user = db.session.query(User).get(user.id)
    # gets the user who commented the comment to be downvoted
    comment_user = db.session.query(User).get(user.id)

    if DislikedComment.query.filter_by(comment_id=comment.id).first() is None:
        disliked_comment = DislikedComment(comment_id=comment.id)
        db.session.add(disliked_comment)
        curr_user.disliked_comments.append(disliked_comment)
        curr_comment = db.session.query(Comment).get(comment_id)
        curr_comment.net_upvotes = curr_comment.net_upvotes - 1
        comment_user.points = comment_user.points + 10
        db.session.commit()

        response = []

        return jsonify({'response': response}), 200
    else:
        disliked_comment = DislikedComment.query.filter_by(comment_id=comment.id).first()

    if disliked_comment in user.disliked_comments:
        disliked_comment = db.session.query(DislikedComment).get(disliked_comment.id)
        curr_user.disliked_comments.remove(disliked_comment)
        curr_comment = db.session.query(Comment).get(comment_id)
        curr_comment.net_upvotes = curr_comment.net_upvotes + 1
        comment_user.points = comment_user.points + 10
        db.session.commit()
        response = []
        return jsonify({'response': response}), 204
    else:
        disliked_comment = db.session.query(DislikedComment).get(disliked_comment.id)
        curr_user.disliked_comments.append(disliked_comment)
        curr_comment = db.session.query(Comment).get(comment_id)
        curr_comment.net_upvotes = curr_comment.net_upvotes - 1
        comment_user.points = comment_user.points + 10
        db.session.commit()

        response = []

        return jsonify({'response': response}), 200

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

@bp.route('/posts/<int:post_id>/upvote', methods=['OPTIONS'])
@cross_origin()
def upvote_options():
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/posts/<int:post_id>/upvote', methods=['POST'])
def upvote(post_id):
    upvote_data = request.get_json(force=True)
    user = User.query.filter_by(email=upvote_data['user_email']).first()
    post = Post.query.filter_by(id=upvote_data['post_id']).first()
    curr_user = db.session.query(User).get(user.id)
    post_user = db.session.query(User).get(post.user_id)
    if LikedPost.query.filter_by(post_id=post.id).first() is None:
        liked_post = LikedPost(post_id=post.id)
        db.session.add(liked_post)
        curr_user.liked_posts.append(liked_post)
        curr_post = db.session.query(Post).get(upvote_data['post_id'])
        curr_post.net_upvotes = curr_post.net_upvotes + 1
        post_user.points = post_user.points + 10
        db.session.commit()

        response = []
        return jsonify({'response': response}), 200
    else:
        liked_post = LikedPost.query.filter_by(post_id=post.id).first()
        #liked_post = db.session.query(LikedPost).get(liked_post.id)

    if liked_post in user.liked_posts:
        liked_post = db.session.query(LikedPost).get(liked_post.id)
        curr_user.liked_posts.remove(liked_post)
        curr_post = db.session.query(Post).get(upvote_data['post_id'])
        curr_post.net_upvotes = curr_post.net_upvotes - 1
        post_user.points = post_user.points - 10
        db.session.commit()
        response = []
        return jsonify({'response': response}), 204
    else:
        liked_post = db.session.query(LikedPost).get(liked_post.id)
        curr_user.liked_posts.append(liked_post)
        curr_post = db.session.query(Post).get(upvote_data['post_id'])
        curr_post.net_upvotes = curr_post.net_upvotes + 1
        post_user.points = post_user.points + 10
        db.session.commit()

        response = []
        return jsonify({'response': response}), 200

@bp.route('/posts/<int:post_id>/downvote', methods=['OPTIONS'])
@cross_origin()
def downvote_options():
    response = {'hello'}
    return jsonify({'response': response}), 205

@bp.route('/posts/<int:post_id>/downvote', methods=['POST'])
def downvote(post_id):
    upvote_data = request.get_json(force=True)
    user = User.query.filter_by(email=upvote_data['user_email']).first()
    post = Post.query.filter_by(id=upvote_data['post_id']).first()
    curr_user = db.session.query(User).get(user.id)
    post_user = db.session.query(User).get(post.user_id)
    if DislikedPost.query.filter_by(post_id=post.id).first() is None:
        disliked_post = DislikedPost(post_id=post.id)
        db.session.add(disliked_post)
        curr_user.disliked_posts.append(disliked_post)
        curr_post = db.session.query(Post).get(upvote_data['post_id'])
        curr_post.net_upvotes = curr_post.net_upvotes - 1
        post_user.points = post_user.points + 10
        curr_user = db.session.query(Post).get(upvote_data['post_id'])
        db.session.commit()

        response = []

        return jsonify({'response': response}), 200
    else:
        disliked_post = DislikedPost.query.filter_by(post_id=post.id).first()

    if disliked_post in user.disliked_posts:
        disliked_post = db.session.query(DislikedPost).get(disliked_post.id)
        curr_user.disliked_posts.remove(disliked_post)
        curr_post = db.session.query(Post).get(upvote_data['post_id'])
        curr_post.net_upvotes = curr_post.net_upvotes + 1
        post_user.points = post_user.points + 10
        db.session.commit()
        response = []
        return jsonify({'response': response}), 204
    else:
        disliked_post = db.session.query(DislikedPost).get(disliked_post.id)
        curr_user.disliked_posts.append(disliked_post)
        curr_post = db.session.query(Post).get(upvote_data['post_id'])
        curr_post.net_upvotes = curr_post.net_upvotes - 1
        post_user.points = post_user.points + 10
        curr_user = db.session.query(Post).get(upvote_data['post_id'])
        db.session.commit()

        response = []

        return jsonify({'response': response}), 200
