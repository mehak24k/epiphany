from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db, s, mail, app
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
    email = loginData['email'];
    password = loginData['password'];
    remember = False;
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
        user_info.append({'name': current_user.name})
        return jsonify({'user_info': user_info}), 200
    else:
        return jsonify({'obj': obj}), 200

@auth.route('/signup')
def signup():
    return render_template('signup.html')

@auth.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database

    if user: # if a user is found, we want to redirect back to signup page so user can try again
        flash('Email address already exists')
        return redirect(url_for('auth.signup'))

    # create new user with the form data. Hash the password so plaintext version isn't saved.
    new_user = User(email=email, name=name, password=generate_password_hash(password, method='sha256'))

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    token = s.dumps(email, salt='email-confirm')
    msg = Message('Confirm Email', sender='epiphany.orbital@gmail.com', recipients=[email])
    link = url_for('auth.confirm_email', token=token, _external=True)
    msg.body = 'Your link is {}'.format(link)

    mail.send(msg)

    new_user.email_confirmation_sent_on = datetime.now()
    db.session.commit()
    return redirect(url_for('auth.email_sent'))

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
    return render_template('email_confirmed.html', email=request.args.get('email'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))
