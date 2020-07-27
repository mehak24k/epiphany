from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Post
from app import db, s, mail, app
from flask_login import login_user, logout_user, login_required, current_user
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_mail import Mail, Message
from datetime import datetime
from flask_cors import cross_origin, CORS

auth = Blueprint('auth', __name__)

CORS(auth)

@auth.route('/login', methods=['GET'])
def login():
    if current_user.is_authenticated:
        return {'logged_in': 'true'}
    else:
        return {'logged_in': 'false'}

@auth.route('/login', methods=['OPTIONS'])
@cross_origin()
def login_options():
    response = {'hello'}
    return jsonify({'response': response}), 204

@auth.route('/login', methods=['POST'])
@cross_origin()
def login_post():
    loginData = request.get_json(force=True)
    email = loginData['email']
    password = loginData['password']
    remember = False
    user = User.query.filter_by(email=loginData['email']).first()

    # check if user actually exists
    # take the user supplied password, hash it, and compare it to the hashed password in database
    if not user or not check_password_hash(user.password, password):
        obj = {'test': 204}
        return jsonify({'obj': obj}), 204

    # check if user has confirmed their email before login
    if not user.email_confirmed:
        obj = {'test': 206}
        return jsonify({'obj': obj}), 206

    # if the above check passes, then we know the user has the right credentials
    login_user(user, remember=remember)
    obj = {'test': 200}
    if current_user.is_authenticated:
        #return redirect(url_for('main.profile'))
        obj_one = {'loggedInTrue': 123}
        user_info = []
        user_info.append({'name': current_user.name, 'points': current_user.points})

        posts_list = current_user.posts
        posts = []

        for post in posts_list:
            tags_list = post.tags
            tags = []

            for tag in tags_list:
                tags.append({'name': tag.name})
            posts.append({'id': post.id, 'title': post.title, 'body': post.body, 'tags': tags})

        user_info.append({'posts': posts})

        return jsonify({'user_info': user_info}), 200
    else:
        return jsonify({'obj': obj}), 200

@auth.route('/signup', methods=['OPTIONS'])
@cross_origin()
def signup_options():
    response = {'hello'}
    return jsonify({'response': response}), 204

@auth.route('/signup', methods=['POST'])
@cross_origin()
def signup_post():
    signupData = request.get_json(force=True)
    name = signupData['name']
    email = signupData['email']
    password = signupData['password']

    user = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database

    if user: # if a user is found, we want to redirect back to signup page so user can try again
        response = []
        return jsonify({'response': response}), 206

    # create new user with the form data. Hash the password so plaintext version isn't saved.
    new_user = User(email=email, name=name, password=generate_password_hash(password, method='sha256'))

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    token = s.dumps(email, salt='email-confirm')
    msg = Message('Confirm Email', sender='epiphany.orbital@gmail.com', recipients=[email])
    # change url to that in frontend react app to be sent through email here
    link = url_for('auth.confirm_email', token=token, _external=True)
    msg.body = 'Your link is {}'.format(link)

    mail.send(msg)

    new_user.email_confirmation_sent_on = datetime.now()
    db.session.commit()

    response = []
    return jsonify({'response': response}), 200

@auth.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except SignatureExpired:
        return '<h1>The token is expired!</h1>'
    return redirect(url_for('auth.email_confirmed', email=email))

@auth.route('/email_sent')
def email_sent():
    return render_template('email_sent.html')

@auth.route('/email_confirmed')
def email_confirmed():
    # gets the user who is confirming their email
    user = db.session.query(User).filter_by(email=request.args.get('email')).first()
    # updates the email confirmed status
    user.email_confirmed_on = datetime.now()
    user.email_confirmed = True
    # commits the changes to the database
    db.session.commit()
    #return render_template('email_confirmed.html', email=request.args.get('email'))
    return redirect('https://whispering-oasis-25381.herokuapp.com/email_confirmed')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@auth.route('/profile', methods=['OPTIONS'])
@cross_origin()
def profile_options():
    response = {'hello'}
    return jsonify({'response': response}), 204

@auth.route('/profile', methods=['POST'])
@cross_origin()
def profile():
    user_data = request.get_json(force=True)
    user_email = user_data['email']
    user = User.query.filter_by(email=user_email).first()
    posts_list = user.posts
    posts = []
    liked_posts_list = user.liked_posts
    liked_posts = []
    #posts.append(posts_list)

    who_user_is_following = user.followed.all()
    who_follows_user = user.followers.all()
    user_is_following = []
    user_is_followed_by = []

    for f in who_user_is_following:
        user_is_following.append({'name': f.name, 'user_id': f.id})

    for f in who_follows_user:
        user_is_followed_by.append({'name': f.name, 'user_id': f.id})

    for post in liked_posts_list:
        my_post = Post.query.filter_by(id=post.post_id).first()
        if my_post is not None:
            tags_list = my_post.tags
            tags = []

            for tag in tags_list:
                tags.append({'name': tag.name})
            liked_posts.append({'id': my_post.id, 'title': my_post.title, 'body': my_post.body, 'tags': tags})

    for post in posts_list:
        tags_list = post.tags
        tags = []

        for tag in tags_list:
            tags.append({'name': tag.name})
        posts.append({'id': post.id, 'title': post.title, 'body': post.body, 'tags': tags})

    user_info = []
    user_info.append({'posts': posts})
    user_info.append({'liked_posts': liked_posts})
    user_info.append({'points': user.points})
    user_info.append({'user_is_following': user_is_following})
    user_info.append({'user_is_followed_by': user_is_followed_by})

    return jsonify({'user_info': user_info}), 206

@auth.route('/users/<int:user_id>', methods=['OPTIONS'])
@cross_origin()
def user_options():
    response = {'hello'}
    return jsonify({'response': response}), 204

@auth.route('/users/<int:user_id>', methods=['POST'])
@cross_origin()
def user(user_id):
    user_data = request.get_json(force=True)
    user_id = user_data['id']
    current_user = User.query.filter_by(email=user_data['current_user_email']).first()
    user = User.query.filter_by(id=user_id).first()
    posts_list = user.posts
    posts = []
    #posts.append(posts_list)

    who_user_is_following = user.followed.all()
    who_follows_user = user.followers.all()
    user_is_following = []
    user_is_followed_by = []
    check = current_user.is_following(user)

    for f in who_user_is_following:
        user_is_following.append({'name': f.name, 'user_id': f.id})

    for f in who_follows_user:
        user_is_followed_by.append({'name': f.name, 'user_id': f.id})

    for post in posts_list:
        tags_list = post.tags
        tags = []

        for tag in tags_list:
            tags.append({'name': tag.name})
        posts.append({'id': post.id, 'title': post.title, 'body': post.body, 'tags': tags})

    user_info = []
    user_info.append({'name': user.name})
    user_info.append({'points': user.points})
    user_info.append({'posts': posts})
    user_info.append({'email': user.email})
    user_info.append({'id': user_id})
    user_info.append({'user_is_following': user_is_following})
    user_info.append({'user_is_followed_by': user_is_followed_by})
    user_info.append({'check': check})

    return jsonify({'user_info': user_info}), 206
