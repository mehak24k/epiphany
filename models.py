from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__="users2"
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    name = db.Column(db.String(1000))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    posts = db.relationship("Post", backref="user", lazy=True)
    email_confirmation_sent_on = db.Column(db.DateTime, nullable=True)
    email_confirmed = db.Column(db.Boolean, nullable=True, default=False)
    email_confirmed_on = db.Column(db.DateTime, nullable=True)
    points = db.Column(db.Integer, default=0)

class Post(db.Model):
    __tablename__="posts"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users2.id'), nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow())
    title = db.Column(db.String, nullable=False)
    body = db.Column(db.String, nullable=False)
    category_id = db.Column(db.Integer(), db.ForeignKey('categories.id'))
    is_file = db.Column(db.Boolean, nullable=True, default=False)

class Category(db.Model):
    __tablename__="categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    # we can access a post's module using this e.g.
    # my_post.module.name or my_post.module.code
    posts = db.relationship('Post', backref='category')

post_tags = db.Table('post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'))
)

class Tag(db.Model):
    __tablename__="tags"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    # we can access a post's module using this e.g.
    # my_post.tag
    posts = db.relationship('Post', secondary=post_tags, backref='tags')
