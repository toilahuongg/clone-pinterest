from flask import request, Response
import jwt, os
from models import User, Role

def Auth(func):
  def checkToken(*args, **kwargs):
    try:
      token = request.headers['authorization']
      data = jwt.decode(token, os.getenv('SECRET_KEY'),  algorithms=["HS256"])
      request.username = data.get('username')
      return func(*args, **kwargs)
    except:
      return Response('Authorization failed', status=401)
  return checkToken
def Admin(func):
  def checkToken(*args, **kwargs):
    try:
      user = User.query.filter_by(username=request.username).first()
      roleAdmin = Role.query.filter_by(value="admin").first()
      if not user in roleAdmin.users: return Response('Forbidden', status=403)
      return func(*args, **kwargs)
    except NameError:
      return Response('Forbidden', status=403)
  return checkToken