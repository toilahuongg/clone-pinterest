from flask import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.declarative import DeclarativeMeta
db = SQLAlchemy()
class User(db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  username = db.Column(db.String(100), unique=True, nullable=False)
  password = db.Column(db.String(100), nullable=False)
  fullname = db.Column(db.String(100), nullable=False)
  email = db.Column(db.String(100), unique=True, nullable=False)
  gender = db.Column(db.String(100), nullable=False)
  role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
  collections = db.relationship('Collection', backref='collection', lazy=True)  
  active = db.Column(db.Boolean, default=True, nullable=False),  
  createdAt = db.Column(db.DateTime, default=db.func.now())
  updatedAt = db.Column(db.DateTime, default=db.func.now(), server_onupdate=db.func.now())

class Role(db.Model):
  __tablename__ = 'roles'
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String(100), unique=True, nullable=False)
  value = db.Column(db.String(100), unique=True, nullable=False)
  users = db.relationship('User', backref='role', lazy=True)
  createdAt = db.Column(db.DateTime, default=db.func.now())
  updatedAt = db.Column(db.DateTime, default=db.func.now(), server_onupdate=db.func.now())

class Collection(db.Model):
  __tablename__ = 'collections'
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  title = db.Column(db.String(100), unique=True, nullable=False)
  description = db.Column(db.String(100))
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  createdAt = db.Column(db.DateTime, default=db.func.now())
  updatedAt = db.Column(db.DateTime, default=db.func.now(), server_onupdate=db.func.now())
class AlchemyEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj.__class__, DeclarativeMeta):
      # an SQLAlchemy class
      fields = {}
      for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
          data = obj.__getattribute__(field)
          try:
              json.dumps(data)
              fields[field] = data
          except TypeError:
              fields[field] = None
      # a json-encodable dict
      return fields
    return json.JSONEncoder.default(self, obj)