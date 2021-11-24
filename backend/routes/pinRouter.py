from flask import Blueprint, json, request, jsonify
from helpers.files import removeFile, uploadFile
from helpers.slug import slug
from middlewares import Auth
from models import Collection, Pin, User, db
pinRouter = Blueprint('pinRouter', __name__)

@pinRouter.route('/<slug>', methods=["GET"])
def getPinBySlug(slug):
  pin = Pin.query.filter_by(slug=slug).first()
  result = json.loads(json.dumps(pin))
  result['comments'] = list(json.loads(json.dumps(pin.comments)))[::-1]
  return jsonify(result)

@pinRouter.route('', methods=["GET"])
def getAllPin():
  title = request.args.get('title', '')
  limit = request.args.get('limit', 30)
  page = request.args.get('page', 0)
  pins = Pin.query.filter(Pin.title.like('%'+title+'%')).order_by(Pin.id.desc()).offset(int(limit)*int(page)).limit(int(limit)).all()
  count = Pin.query.count()
  return jsonify({ 'count': count, 'pins': pins})

@pinRouter.route('', methods=["POST"])
@Auth
def postPin():
  title = request.form.get('title', '')
  content = request.form.get('content', '')
  link = request.form.get('link', '')
  width = request.form.get('width', 0)
  height = request.form.get('height', 0)
  collectionId = request.form.get('collection', '')
  fileFeaturedImage = request.files.get('featuredImage', '')
  
  user = User.query.filter_by(id=request.userId).first()
  collection = Collection.query.filter_by(id=collectionId,user_id=request.userId).first()
  if (not user): return jsonify({ 'error' : 'Tài khoản này không tồn tại' }), 401
  if (not collection): return jsonify({ 'error' : 'Bộ sưu tập này không tồn tại' }), 400
  if (not title): return jsonify({ 'error' : 'title không được để trống' }), 400
  if (not fileFeaturedImage): return jsonify({ 'error' : 'Bạn chưa chọn ảnh' }), 400
  featuredImage = uploadFile(fileFeaturedImage)
  pin = Pin(
    title=title,
    content=content,
    width=width,
    height=height,
    featuredImage=featuredImage,
    user=user,
    slug=slug(title),
    link=link
  )
  collection.pins.append(pin)
  db.session.add(collection)
  db.session.commit()
  return jsonify(pin),200

@pinRouter.route('/<id>', methods=["PUT"])
@Auth
def putPin(id):
  title = request.form.get('title', '')
  content = request.form.get('content', '')
  link = request.form.get('link', '')
  width = request.form.get('width', 0)
  height = request.form.get('height', 0)
  fileFeaturedImage = request.files.get('featuredImage', '')
  
  user = User.query.filter_by(id=request.userId).first()
  pin = Pin.query.filter_by(id=id).first()
  
  if (not user): return jsonify({ 'error' : 'Tài khoản này không tồn tại' }), 401
  if (not title): return jsonify({ 'error' : 'title không được để trống' }), 400
  if(fileFeaturedImage): removeFile(pin.featuredImage)
  featuredImage = uploadFile(fileFeaturedImage)
  newData = dict(
    title=title,
    content=content,
    slug=slug(title),
    link=link
  )
  if (featuredImage):
    newData['featuredImage'] = featuredImage
    newData['width'] = width
    newData['height'] = height
  Pin.query.filter_by(id=id).update(newData)
  db.session.commit()
  return jsonify(Pin.query.filter_by(id=id).first()),200


@pinRouter.route('/<id>/<cId>', methods=["DELETE"])
@Auth
def deletePin(id, cId):
  pin = Pin.query.filter_by(id=id).first()
  if not pin : return jsonify({'error': 'Không tồn tại ghim'}), 400
  if not pin.user_id == request.userId:
    collection = Collection.query.filter_by(id=cId, user_id = request.userId).first()
    collection.pins.remove(pin)
  else:
    removeFile(pin.featuredImage)
    db.session.delete(pin)
  db.session.commit()
  return jsonify('ok'),200

@pinRouter.route('/add-to-collection', methods=["POST"])
@Auth
def addToCollection():
  cId = request.json.get('cId', '')
  pId = request.json.get('pId', '')
  pin = Pin.query.filter_by(id=pId).first()
  collection = Collection.query.filter_by(id=cId, user_id = request.userId).first()
  if not pin: return jsonify({'error': 'Không tồn tại ghim'}), 400
  if not collection: return jsonify({'error': 'Không tồn tại Bộ sưu tập'}), 400
  collection.pins.append(pin)
  db.session.add(collection)
  db.session.commit()
  return jsonify('ok'),200