from datetime import datetime, timedelta
from flask import Blueprint, json, Response, request, jsonify
import re, bcrypt, jwt, os
from models import User, Role, AlchemyEncoder, db
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
    username = request.form.get('username', '').strip().lower()
    fullname = request.form.get('fullname', username)
    password = request.form.get('password', '')
    confirm = request.form.get('confirm', '')
    email = request.form.get('email', '')
    gender = request.form.get('gender', 'male')

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

    return Response(json.dumps(user, cls=AlchemyEncoder), mimetype='application/json', status=200)
  except NameError:
    return jsonify({'error': 'Đã xảy ra lỗi'}), 400

@userRouter.route('/login', methods=['POST'])
def login():
  try:
    username = request.form.get('username', '').strip().lower()
    password = request.form.get('password', '')

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
    
    return jsonify({'token': token}), 200
  except NameError:
    return jsonify({'error': 'Đã xảy ra lỗi'}), 400

#Api kiểm tra user
@userRouter.route('/auth', methods=['GET'])
@Auth
# @Admin
def checkUser():
  return str(request.userId)