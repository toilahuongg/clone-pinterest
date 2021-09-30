import datetime
from flask_mongoengine import MongoEngine
db = MongoEngine()

class UserModel(db.Document):
  username = db.StringField(required=True, unique=True)
  password = db.StringField(required=True)
  fullname = db.StringField(required=True)
  createdAt = db.DateTimeField(default=datetime.datetime.now, required=True)
  updatedAt = db.DateTimeField(default=datetime.datetime.now, required=True)
