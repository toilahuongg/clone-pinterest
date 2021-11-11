from datetime import datetime, timedelta
from flask import Blueprint, json, request, jsonify
import re, bcrypt, jwt, os
from helpers.files import removeFile, uploadFile
from models import User, Role, db
from middlewares import Auth

regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
def checkEmail(email):
  if(re.fullmatch(regex, email)):
    return True
  return False


userRouter = Blueprint('userRouter', __name__)

@userRouter.route('/register', methods=['POST'])
def register():
  try:
    username = str(request.json['username']).strip().lower()
    fullname = request.json['fullname'] if request.json['fullname'] else username
    password = request.json['password']
    confirm = request.json['confirm']
    email = request.json['email']
    gender = request.json['gender'] if request.json['gender'] else 'male'

    #Validate username
    if not username: return jsonify({'error': 'Tài khoản không được để trống'}), 400
    if not re.search('^[a-zA-Z0-9_]{6,29}$', username): 
      return jsonify({'error': 'Tài khoản chứa ký tự không hợp lệ hoặc nhỏ hơn 6 ký tự và lớn hơn 29 ký tự'}), 400
    if User.query.filter_by(username=username).first(): return jsonify({'error': 'Tài khoản đã tồn tại'}), 400

    #Validate password
    if not password: return jsonify({'error': 'Mật khẩu không được để trống'}), 400
    if len(password) < 8: return jsonify({'error': 'Mật khẩu phải lớn hơn hoặc bằng 8 ký tự'}), 400
    if password != confirm: return jsonify({'error': 'Mật khẩu không khớp'}), 400
    
    #Validate email
    if not email: return jsonify({'error': 'Email không được để trống'}), 400
    if not checkEmail(email): return jsonify({'error': 'Email không hợp lệ'}), 400
    if User.query.filter_by(email=email).first(): return jsonify({'error': 'Email đã được sử dụng'}), 400

    #Hash password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    #Save database
    role = Role.query.filter_by(id=2).first()
    user = User(
      username=username,
      password=hashed.decode('utf-8'),
      fullname=fullname,
      email=email,
      gender=gender,
      role=role
    )
    db.session.add(user)
    db.session.commit()

    return jsonify(user),200
  except NameError:
    return jsonify({'error': 'Đã xảy ra lỗi'}), 400

@userRouter.route('/login', methods=['POST'])
def login():
  try:
    username = str(request.json['username']).strip().lower()
    password = request.json['password']

    #Validate username
    if not username: return jsonify({'error': 'Tài khoản không được để trống'}), 400
    user = User.query.filter_by(username=username).first()
    if not user: return jsonify({'error': 'Tài khoản không tồn tại'}), 400 
    #Validate password
    if not password: return jsonify({'error': 'Mật khẩu không được để trống'}), 400
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')): return jsonify({'error': 'Mật khẩu không chính xác'}), 400
    
    #Create token
    token = jwt.encode({
      'id': user.id,
      'username': user.username,
      'fullname': user.fullname,
      'exp' : datetime.utcnow() + timedelta(minutes = 30)
    }, os.getenv('SECRET_KEY'))
    result = json.loads(json.dumps(user))
    result['token'] = token
    return jsonify(result), 200
  except NameError:
    return jsonify({'error': 'Đã xảy ra lỗi'}), 400

#Api kiểm tra user
@userRouter.route('/auth', methods=['GET'])
@Auth
# @Admin
def checkUser():
  user = User.query.filter_by(id=request.userId).first()
  print(user)
  return str(request.userId)


@userRouter.route('/info', methods=['GET'])
@Auth
def getUser():
  user = User.query.filter_by(id=request.userId).first()
  if (not user): return jsonify({ 'error' : 'Tài khoản này không tồn tại' }), 400
  result = {
    'id': user.id,
    'username': user.username,
    'fullname': user.fullname,
    'email': user.email,
    'role_id': user.role_id,
    'gender': user.gender,
    'introduce': user.introduce,
    'avatar': user.avatar,
    'cover': user.cover,
  }
  return result

@userRouter.route('/update-infomation', methods=['PUT'])
@Auth
def updateInfomation():
  fullname = request.form.get('fullname', '')
  introduce = request.form.get('introduce', '')
  gender = request.form.get('gender', '')
  
  user = User.query.filter_by(id=request.userId).first()
  if (not user): return jsonify({ 'error' : 'Tài khoản này không tồn tại' }), 401
  if (not fullname): return jsonify({ 'error' : 'Fullname không được để trống' }), 400
  fileAvatar = request.files.get('avatar', '')
  if(fileAvatar): removeFile(user.avatar)
  avatar = uploadFile(fileAvatar)
  
  fileCover = request.files.get('cover', '')
  if(fileCover): removeFile(user.cover)
  cover = uploadFile(fileCover)
  newData = dict(
    fullname = fullname,
    introduce =  introduce,
    gender = gender
  )
  if (cover):  newData['cover'] = cover
  if (avatar):  newData['avatar'] = avatar
  User.query.filter_by(id=request.userId).update(newData)
  
  db.session.commit()
  return jsonify({ 'avatar': avatar, 'cover': cover }),200

@userRouter.route('/change-password', methods=['PUT'])
@Auth
def changePassword():
  oldPassword = request.json.get('oldPassword', '')
  newPassword = request.json.get('newPassword', '')
  confirmPassword = request.json.get('confirmPassword', '')
  print(oldPassword, newPassword, confirmPassword)
  
  user = User.query.filter_by(id=request.userId).first()
  if (not user): return jsonify({ 'error' : 'Tài khoản này không tồn tại' }), 401
  if not bcrypt.checkpw(oldPassword.encode('utf-8'), user.password.encode('utf-8')): return jsonify({'error': 'Mật khẩu không chính xác'}), 400
  if (not newPassword): return jsonify({ 'error' : 'Mật khẩu mới không được để trống' }), 400
  if len(newPassword) < 8: return jsonify({'error': 'Mật khẩu phải lớn hơn hoặc bằng 8 ký tự'}), 400
  if newPassword != confirmPassword: return jsonify({'error': 'Mật khẩu không khớp'}), 400
  
  hashed = bcrypt.hashpw(newPassword.encode('utf-8'), bcrypt.gensalt())
  User.query.filter_by(id=request.userId).update(dict(
    password=hashed.decode('utf-8')
  ))
  db.session.commit()
  return jsonify({'success': 'Cập nhật thành công'}), 200

@userRouter.route('/<username>', methods=['GET'])
def getUserByUsername(username):
  user = User.query.filter_by(username=username).first()
  if (not user): return jsonify({ 'error' : 'Tài khoản này không tồn tại' })
  result = {
    'id': user.id,
    'username': user.username,
    'fullname': user.fullname,
    'gender': user.gender,
    'introduce': user.introduce,
    'avatar': user.avatar,
    'cover': user.cover,
  }
  return jsonify(result)