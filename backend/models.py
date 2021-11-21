from dataclasses import dataclass
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

IGNORE_FIELD = ['password', 'query', 'query_class', 'registry']
@dataclass
class User(db.Model):
  __tablename__ = 'users'
  id: int
  username: str
  password: str
  fullname: str
  email: str
  gender: str
  introduce: str
  avatar: str
  cover: str
  role_id: int
  createdAt: datetime
  updatedAt: datetime

  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  username = db.Column(db.String(100), unique=True, nullable=False)
  password = db.Column(db.String(100), nullable=False)
  fullname = db.Column(db.String(100), nullable=False)
  email = db.Column(db.String(100), unique=True, nullable=False)
  gender = db.Column(db.String(100), nullable=False)
  introduce = db.Column(db.String(), nullable=True)
  avatar = db.Column(db.String(), nullable=True)
  cover = db.Column(db.String(), nullable=True)
  role_id = db.Column(db.Integer, db.ForeignKey('roles.id', ondelete="SET NULL"))
  collections = db.relationship('Collection', backref='user', lazy=True, passive_deletes="all")  
  pins = db.relationship('Pin', backref='user', lazy=True, passive_deletes="all")  
  createdAt = db.Column(db.DateTime, default=db.func.now())
  updatedAt = db.Column(db.DateTime, default=db.func.now(), server_onupdate=db.func.now())
@dataclass
class Role(db.Model):
  __tablename__ = 'roles'
  id: int
  name: str
  value: str
  createdAt: datetime
  updatedAt: datetime

  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String(100), unique=True)
  value = db.Column(db.String(100), unique=True)
  users = db.relationship('User', backref='role', lazy=True)
  createdAt = db.Column(db.DateTime, default=db.func.now())
  updatedAt = db.Column(db.DateTime, default=db.func.now(), server_onupdate=db.func.now())
  
pins = db.Table('collection_pin',
  db.Column('collection_id', db.Integer, db.ForeignKey('collections.id', ondelete="CASCADE"), primary_key=True),
  db.Column('pin_id', db.Integer, db.ForeignKey('pins.id', ondelete="CASCADE"), primary_key=True),
  db.Column('createdAt', db.DateTime, default=db.func.now())
)
@dataclass
class Collection(db.Model):
  __tablename__ = 'collections'
  id: int
  title: str
  description: str
  user_id: int
  isPublic: bool
  slug: str
  createdAt: datetime
  updatedAt: datetime

  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  title = db.Column(db.String(100), nullable=False)
  description = db.Column(db.String(100))
  user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
  isPublic = db.Column(db.Boolean, default=False)
  pins = db.relationship('Pin', secondary=pins, lazy='subquery',
        backref=db.backref('collections', lazy=True))
  slug = db.Column(db.String(100), nullable=False)
  createdAt = db.Column(db.DateTime, default=db.func.now())
  updatedAt = db.Column(db.DateTime, default=db.func.now(), server_onupdate=db.func.now())

@dataclass
class Pin(db.Model):
  __tablename__ = 'pins'
  id: int
  title: str
  content: str
  width: int
  height: int
  featuredImage: str
  user_id: int
  slug: str
  createdAt: datetime
  updatedAt: datetime

  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  title = db.Column(db.String(100), nullable=False)
  content = db.Column(db.String(4294000000))
  width = db.Column(db.Integer)
  height = db.Column(db.Integer)
  featuredImage = db.Column(db.String(100), nullable=False)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
  slug = db.Column(db.String(100), nullable=False)
  createdAt = db.Column(db.DateTime, default=db.func.now())
  updatedAt = db.Column(db.DateTime, default=db.func.now(), server_onupdate=db.func.now())
