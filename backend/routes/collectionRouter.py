from flask import Blueprint, request, jsonify, Response
from middlewares import Auth
from models import Collection, User, db
collectionRouter = Blueprint('collectionRouter', __name__)

@collectionRouter.route('', methods=["POST"])
# @Auth
def postCollection():
  title = request.form.get('title', '')
  description = request.form.get('description', '')
  isPublish = request.form.get('isPublish', 'true')
  if not title: return jsonify({'error': 'title không được để trống'}), 400
  user = User.query.filter_by(id=1).first()
  data = Collection(
    title=title,
    description=description,
    isPublish=True if isPublish == "true" else False,
    user=user
  )
  db.session.add(data)
  db.session.commit()
  return jsonify(data),200

@collectionRouter.route('/<id>', methods=["PUT"])
def putCollection(id):
  title = request.form.get('title', '')
  description = request.form.get('description', '')
  isPublish = request.form.get('description', True)
  collection = Collection.query.filter_by(id=id).update(dict(
    title=title,
    description=description,
    isPublish=isPublish,
  ))
  db.session.commit()
  return jsonify(collection),200

