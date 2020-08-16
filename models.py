from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('users2.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('users2.id'))
)

class User(UserMixin, db.Model):
    __tablename__="users2"
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    name = db.Column(db.String(1000))
    email = db.Column(db.String(100), unique=True, nullable=False)
    is_student = db.Column(db.Boolean, nullable=True, default=False)
    is_staff = db.Column(db.Boolean, nullable=True, default=False)
    password = db.Column(db.String(100), nullable=False)
    posts = db.relationship("Post", backref="user", lazy=True)
    email_confirmation_sent_on = db.Column(db.DateTime, nullable=True)
    email_confirmed = db.Column(db.Boolean, nullable=True, default=False)
    email_confirmed_on = db.Column(db.DateTime, nullable=True)
    points = db.Column(db.Integer, default=0)
    comments = db.relationship("Comment", backref="user", lazy=True)
    followed = db.relationship('User',
        secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy = 'dynamic'),
        lazy='dynamic')

    def is_following(self, user):
        return self.followed.filter(followers.c.followed_id == user.id).count() > 0
    
    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)
    
    def get_followed_posts(self):
        return Post.query.join(
            followers, (followers.c.followed_id == Post.user_id)).filter(
                followers.c.follower_id == self.id).order_by(
                    Post.user_id)

class Post(db.Model):
    __tablename__="posts"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users2.id'), nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    title = db.Column(db.String, nullable=False)
    body = db.Column(db.String, nullable=False)
    category_id = db.Column(db.Integer(), db.ForeignKey('categories.id'))
    is_file = db.Column(db.Boolean, nullable=True, default=False)
    comments = db.relationship("Comment", backref="post", lazy=True)
    net_upvotes = db.Column(db.Integer, default=0)

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
    # my_post.tags
    posts = db.relationship('Post', secondary=post_tags, backref='tags')

user_likedposts = db.Table('user_likedposts',
    db.Column('post_id', db.Integer, db.ForeignKey('likedposts.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users2.id'))
)

class LikedPost(db.Model):
    __tablename__="likedposts"
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer)
    users = db.relationship('User', secondary=user_likedposts, backref='liked_posts')

user_dislikedposts = db.Table('user_dislikedposts',
    db.Column('post_id', db.Integer, db.ForeignKey('dislikedposts.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users2.id'))
)

class DislikedPost(db.Model):
    __tablename__="dislikedposts"
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, unique=True, nullable=False)
    users = db.relationship('User', secondary=user_dislikedposts, backref='disliked_posts')

user_likedcomments = db.Table('user_likedcomments',
    db.Column('comment_id', db.Integer, db.ForeignKey('likedcomments.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users2.id'))
)

class LikedComment(db.Model):
    __tablename__="likedcomments"
    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer, unique=True, nullable=False)
    users = db.relationship('User', secondary=user_likedcomments, backref='liked_comments')

user_dislikedcomments = db.Table('user_dislikedcomments',
    db.Column('comment_id', db.Integer, db.ForeignKey('dislikedcomments.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users2.id'))
)

class DislikedComment(db.Model):
    __tablename__="dislikedcomments"
    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer, unique=True, nullable=False)
    users = db.relationship('User', secondary=user_dislikedcomments, backref='disliked_comments')


class Comment(db.Model):
    _N = 6
    __tablename__="comments"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users2.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow())
    text = db.Column(db.String, nullable=False)
    # for threaded comments
    path = db.Column(db.Text, index=True)
    parent_id = db.Column(db.Integer, db.ForeignKey("comments.id"))
    replies = db.relationship("Comment", backref=db.backref('parent', remote_side=[id]), lazy="dynamic")
    net_upvotes = db.Column(db.Integer, default=0)

    def save(self):
        db.session.add(self)
        db.session.commit()
        prefix = self.parent.path + '.' if self.parent else ''
        self.path = prefix + '{:0{}d}'.format(self.id, self._N)
        db.session.commit()

    def level(self):
        return len(self.path) // (self._N - 1)
