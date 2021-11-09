from flask import request, Response
import jwt, os
from models import User, Role

def Auth(func):
  def checkToken(*args, **kwargs):
    try:
      token = request.headers['authorization']
      print(token)
      data = jwt.decode(token, os.getenv('SECRET_KEY'),  algorithms=["HS256"])
      request.userId = data.get('id')
      return func(*args, **kwargs)
    except:
      return Response('Authorization failed', status=401)
  checkToken.__name__ = func.__name__
  return checkToken
def Admin(func):
  def checkAdmin(*args, **kwargs):
    try:
      user = User.query.filter_by(id=request.userId).first()
      roleAdmin = Role.query.filter_by(value="admin").first()
      if not user in roleAdmin.users: return Response('Forbidden', status=403)
      return func(*args, **kwargs)
    except:
      return Response('Forbidden', status=403)
  checkAdmin.__name__ = func.__name__
  return checkAdmin