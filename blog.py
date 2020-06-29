from flask import Blueprint, flash, g, redirect, render_template, request, url_for, jsonify, json, send_from_directory
from flask_login import login_required, current_user
from werkzeug.exceptions import abort
from .models import User, Post, Category, Tag, Comment
from . import db, app
import os
from werkzeug.utils import secure_filename

bp = Blueprint('blog', __name__)

UPLOAD_FOLDER = '/Users/Mehak/Desktop/epiphany/static'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    tags_list = Tag.query.all()
    tags = []

    for tag in tags_list:
        tags.append({'name': tag.name})

    if request.method == 'POST':
        title = request.form.get('title')
        body = request.form.get('body')
        tags = request.form.getlist('tags')
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

            for tag in tags:
                curr_tag = db.session.query(Tag).filter_by(name=tag).first()
                if curr_tag is None:
                    new_tag = Tag(name=tag)
                    db.session.add(new_tag)
                    new_post.tags.append(new_tag);
                else:
                    new_post.tags.append(curr_tag);

            db.session.add(new_post)
            db.session.commit()
            return redirect(url_for('main.index'))
    return render_template('blog/create.html', tags=tags)

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
    comments = db.session.query(Comment).filter_by(post_id=post_id).order_by(Comment.timestamp.desc(), Comment.path.asc()).all()
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
    else:
        tags_list = Tag.query.all()
        tags = []
        for tag in tags_list:
            tags.append({'name': tag.name})

        added_tags = []
        for tag in result[0].tags:
            added_tags.append(tag.name)

    if request.method == 'POST':
        title = request.form.get('title')
        body = request.form.get('body')
        tags = request.form.getlist('tags')
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
            new_post.tags = []
            for tag in tags:
                curr_tag = db.session.query(Tag).filter_by(name=tag).first()
                if curr_tag is None:
                    new_tag = Tag(name=tag)
                    db.session.add(new_tag)
                    new_post.tags.append(new_tag);
                else:
                    new_post.tags.append(curr_tag);

            db.session.commit()
            flash("Your post has been updated.")
            return redirect(url_for('main.index'))

    comments = get_comments(post_id)

    return render_template('blog/update.html', post=result[0], added_tags=added_tags, tags=tags, comments=comments)

@bp.route('/posts/<int:post_id>/delete', methods=['POST'])
@login_required
def delete(post_id):
    post = db.session.query(Post).get(post_id)
    db.session.delete(post)
    db.session.commit()

    flash("Your post has been deleted.")
    return redirect(url_for('main.index'))

@bp.route('/upload', methods=['GET', 'POST'])
def upload():
    tags_list = Tag.query.all()
    tags = []
    added_tags = []

    for tag in tags_list:
        tags.append({'name': tag.name})

    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            #return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            #return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            title = request.form.get('title')
            # set body to path of file, so we can obtain it later to display
            body = filename
            tags = request.form.getlist('tags')
            t_error = None

            if not title:
                t_error = 'Title is required.'

            if t_error is not None:
                flash(t_error)

            else:
                new_post = Post(title=title, body=body, user_id=current_user.id, is_file=True)

                for tag in tags:
                    curr_tag = db.session.query(Tag).filter_by(name=tag).first()
                    if curr_tag is None:
                        new_tag = Tag(name=tag)
                        db.session.add(new_tag)
                        new_post.tags.append(new_tag);
                    else:
                        new_post.tags.append(curr_tag);

                db.session.add(new_post)
                db.session.commit()

                return redirect(url_for('main.index'))
    return render_template('upload.html', added_tags=added_tags, tags=tags)

'''
@bp.route('/posts/<int:post_id>/category/<module>', methods=['GET'])
@login_required
def category(module, post_id):
    post = db.session.query(Post).get(post_id)
    post.module = db.session.query(Module).filter_by(code=module).first()
    db.session.commit()

    flash("Your post is now under module " + module)
    return redirect(url_for('main.index'))
'''
@bp.route('/posts/<int:post_id>/comment', methods=['POST'])
@login_required
def comment(post_id):
    comment = request.form.get('comment')
    new_comment = Comment(text=comment, user_id=current_user.id, post_id=post_id)
    new_comment.save()
    return redirect(url_for('blog.indiv_post', post_id=post_id))
