from flask import Blueprint, request, jsonify, json, Response
from models import AlchemyEncoder, Collection, User, db
collectionRouter = Blueprint('collectionRouter', __name__)

@collectionRouter.route('', methods=["POST"])
def postCollection():
  title = request.form.get('title', '')
  description = request.form.get('description', '')
  isPublish = request.form.get('isPublish', 'true')
  user = User.query.filter_by(id=1).first()
  data = Collection(
    title=title,
    description=description,
    isPublish=True if isPublish == "true" else False,
    user=user
  )
  db.session.add(data)
  db.session.commit()
  return Response(json.dumps(data, cls=AlchemyEncoder), mimetype='application/json', status=200)

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
  return Response(json.dumps(collection, cls=AlchemyEncoder), mimetype='application/json', status=200)

