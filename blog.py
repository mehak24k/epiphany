from flask import Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
from flask_login import login_required, current_user
from werkzeug.exceptions import abort
from .models import User, Post, Module, Comment
from . import db

bp = Blueprint('blog', __name__)

@bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    if request.method == 'POST':
        title = request.form.get('title')
        body = request.form.get('body')
        t_error = None
        b_error = None

        if not title:
            t_error = 'Title is required.'

        if not body:
            b_error = 'Body is required.'

        if t_error or b_error is not None:
            if t_error is not None:
                flash(t_error)
            if b_error is not None:
                flash(b_error)

        else:
            new_post = Post(title=title, body=body, user_id=current_user.id)
            db.session.add(new_post)
            db.session.commit()
            return redirect(url_for('main.index'))
    return render_template('blog/create.html')

# method that gets a particular post and any error messages
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

# method that gets all the comments in a post
def get_comments(post_id):
    comments = db.session.query(Comment).filter_by(post_id=post_id).order_by(Comment.path.asc(), Comment.timestamp.desc()).all()
    return comments 

@bp.route('/posts/<int:post_id>')
def indiv_post(post_id):
    post = get_post(post_id, False)

    # case where there is an error in accessing the post
    if post[1] != None:
        flash(post[1])
        return redirect(url_for('main.index'))

    comments = get_comments(post_id)

    return render_template('blog/post.html', post=post[0], comments=comments)

@bp.route('/posts/<int:post_id>/update', methods=['GET', 'POST'])
@login_required
def update(post_id):
    result = get_post(post_id)

    if result[1] != None:
        flash(result[1])
        return redirect(url_for('main.index'))

    if request.method == 'POST':
        title = request.form.get('title')
        body = request.form.get('body')
        t_error = None
        b_error = None

        if not title:
            t_error = 'Title is required.'

        if not body:
            b_error = 'Body is required.'

        if t_error or b_error is not None:
            if t_error is not None:
                flash(t_error)
            if b_error is not None:
                flash(b_error)

        else:

            new_post = db.session.query(Post).get(post_id)
            new_post.title = title
            new_post.body = body
            db.session.commit()

            flash("Your post has been updated.")
            return redirect(url_for('main.index'))

    comments = get_comments(post_id)

    return render_template('blog/update.html', post=result[0], comments=comments)

@bp.route('/posts/<int:post_id>/delete', methods=['POST'])
@login_required
def delete(post_id):
    post = db.session.query(Post).get(post_id)
    db.session.delete(post)
    db.session.commit()

    flash("Your post has been deleted.")
    return redirect(url_for('main.index'))

@bp.route('/posts/<int:post_id>/category/<module>', methods=['GET'])
@login_required
def category(module, post_id):
    post = db.session.query(Post).get(post_id)
    post.module = db.session.query(Module).filter_by(code=module).first()
    db.session.commit()

    flash("Your post is now under module " + module)
    return redirect(url_for('main.index'))

@bp.route('/posts/<int:post_id>/comment', methods=['POST'])
@login_required
def comment(post_id): 
    comment = request.form.get('comment')
    new_comment = Comment(text=comment, user_id=current_user.id, post_id=post_id)
    new_comment.save()
    return redirect(url_for('blog.indiv_post', post_id=post_id))

@bp.route('/posts/<int:post_id>/<int:comment_id>/reply', methods=['POST'])
@login_required
def reply(post_id, comment_id): 
    reply = request.form.get('reply')
    parent = Comment.query.get(comment_id)
    new_comment = Comment(text=reply, user_id=current_user.id, post_id=post_id, parent=parent)
    new_comment.save()
    return redirect(url_for('blog.indiv_post', post_id=post_id))