from flask import Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
from flask_login import login_required, current_user
from werkzeug.exceptions import abort
from models import User, Post
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

@bp.route('/posts/<int:post_id>')
def indiv_post(post_id):
    post = get_post(post_id, False)

    if post[1] != None:
        flash(post[1])
        return redirect(url_for('main.index'))

    tags_list = post[0].tags
    tags = []

    for tag in tags_list:
        tags.append({'name': tag.name})
    json_post = {'id': post[0].id, 'title': post[0].title, 'body': post[0].body, 'tags': tags}

    return jsonify({'json_post': json_post})

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
