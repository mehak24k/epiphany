from flask import Blueprint, flash, g, redirect, render_template, request, url_for
from flask_login import login_required, current_user
from werkzeug.exceptions import abort
from .models import User, Post
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
                flash(terror)
            if b_error is not None:
                flash(berror)

        else:
            new_post = Post(title=title, body=body, user_id=current_user.id)
            db.session.add(new_post)
            db.session.commit()
            return redirect(url_for('main.index'))
    return render_template('blog/create.html')

@bp.route('/posts/<int:post_id>')
def get_post(post_id, check_author=True): 
    # Make sure post exists.
    post = Post.query.get(post_id)
        
    if post is None:
        flash('Post does not exist. Please try again.')
        return redirect(url_for('main.index'))

    return render_template("blog/post.html", post=post)