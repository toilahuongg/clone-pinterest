from flask import request, Response
import jwt, os
def Auth(func):
  def checkToken(*args, **kwargs):
    # try:
      token = request.headers['authorization']
      data = jwt.decode(token, os.getenv('SECRET_KEY'),  algorithms=["HS256"])
      request.username = data.get('username')
      return func(*args, **kwargs)
    # except:
      # return Response('Authorization failed', status=401)
  return checkToken