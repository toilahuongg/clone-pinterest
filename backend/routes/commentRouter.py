from flask import Blueprint, json, request, jsonify
from middlewares import Auth
from models import Comment, Pin, User, db
from helpers.slug import slug
commentRouter = Blueprint('commentRouter', __name__)

@commentRouter.route('', methods=["POST"])
@Auth
def postComment():
  content = request.json.get('content', '')
  userId = request.json.get('user_id', 0)
  pinId = request.json.get('pin_id', 0)
  pin = Pin.query.filter_by(id=pinId).first()
  comment = Comment(
    content=content,
    user_id=userId,
  )
  pin.comments.append(comment)
  db.session.add(pin)
  db.session.commit()
  result = json.loads(json.dumps(comment))
  result['user'] = json.loads(json.dumps(User.query.filter_by(id=userId).first()))
  return jsonify(result)

@commentRouter.route('/<id>', methods=["GET"])
def getCommentByPin(id):
  comments = Comment.query.filter_by(pin_id=id).all()
  result = []
  for comment in comments:
    dictComment = json.loads(json.dumps(comment))
    dictComment['user'] = json.loads(json.dumps(User.query.filter_by(id=comment.user_id).first()))
    result.append(dictComment)
  return jsonify(result)