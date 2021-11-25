from typing import Any
from flask import Blueprint, json, request, jsonify
from middlewares import Auth
from models import Collection, User, db, Pin
from helpers.slug import slug
collectionRouter = Blueprint('collectionRouter', __name__)

@collectionRouter.route('/<slug>/pins', methods=["GET"])
def getPinByCollection(slug):
  title = request.args.get('title', '')
  limit = request.args.get('limit', 30)
  page = request.args.get('page', 0)
  collection = Collection.query.filter_by(slug=slug).first()
  listId = list(map(lambda item: item.id, collection.pins))
  pins = Pin.query.filter(Pin.id.in_(listId), Pin.title.like("%"+title+"%")).order_by(Pin.id.desc()).offset(int(limit)*int(page)).limit(int(limit)).all()
  count = Pin.query.filter(Pin.id.in_(listId), Pin.title.like("%"+title+"%")).count()
  return jsonify({ 'count': count, 'pins': pins })

@collectionRouter.route('/<slug>', methods=["GET"])
def getCollectionBySlug(slug):
  collection = Collection.query.filter_by(slug=slug).first()
  if not collection: return jsonify({'error': 'Collection không tồn tại'})
  result = json.loads(json.dumps(collection))
  # result['pins'] = list(json.loads(json.dumps(collection.pins)))[::-1]
  return jsonify(result)


@collectionRouter.route('', methods=["POST"])
@Auth
def postCollection():
  title = request.json.get('title', '')
  description = request.json.get('description', '')
  isPublic = request.json.get('isPublic', False)
  if not title: return jsonify({'error': 'title không được để trống'}), 400
  user = User.query.filter_by(id=request.userId).first()
  if (not user): return jsonify({ 'error' : 'Tài khoản này không tồn tại' }), 401
  collection = Collection(
    title=title,
    description=description,
    isPublic=isPublic,
    slug=slug(title),
    user=user
  )
  db.session.add(collection)
  try:
    db.session.commit()
  except: 
    print("lỗi")
  return jsonify(collection)

@collectionRouter.route('/<id>', methods=["PUT"])
@Auth
def putCollection(id):
  dataForm = dict(request.get_json())
  title = dataForm.get('title', '') 
  description = dataForm.get('description', '')
  isPublic = dataForm.get('isPublic', False)
  Collection.query.filter_by(id=id).update(dict(
    title=title,
    description=description,
    isPublic=isPublic,
    slug=slug(title)
  ))
  try:
    db.session.commit()
  except: 
    print("lỗi")
  collection = Collection.query.filter_by(id=id).first()
  if not collection: return jsonify({'error': 'Collection không tồn tại'})
  result = json.loads(json.dumps(collection))
  result['pins'] = list(json.loads(json.dumps(collection.pins)))[0:1]
  return jsonify(result),200

@collectionRouter.route('/<id>', methods=["DELETE"])
@Auth
def deleteCollection(id):
  collection = Collection.query.filter_by(id=id, user_id = request.userId).first()
  if not collection: return jsonify({'error': 'Không tồn tại bộ sưu tập'}), 400
  db.session.delete(collection)
  try:
    db.session.commit()
  except: 
    print("lỗi")
  return jsonify(collection),200

