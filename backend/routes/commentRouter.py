from flask import Blueprint, json, request, jsonify
from middlewares import Auth
from models import Comment, Pin, User, db
from helpers.slug import slug
commentRouter = Blueprint('commentRouter', __name__)

@commentRouter.route('', methods=["POST"])
@Auth
def postComment():
  content = request.json.get('content', '')
  pinId = request.json.get('pin_id', 0)
  pin = Pin.query.filter_by(id=pinId).first()
  comment = Comment(
    content=content,
    user_id=request.userId,
  )
  pin.comments.append(comment)
  db.session.add(pin)
  try:
    db.session.commit()
  except: 
    print("lỗi")
  result = json.loads(json.dumps(comment))
  result['user'] = json.loads(json.dumps(User.query.filter_by(id=request.userId).first()))
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

