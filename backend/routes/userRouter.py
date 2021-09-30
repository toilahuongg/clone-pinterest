from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
import re, bcrypt, jwt, os
from models import UserModel
from middlewares import Auth
userRouter = Blueprint('userRouter', __name__)

@userRouter.route('/', methods=['POST'])
def register():
  try:
    #Validate
    username = request.form['username'].strip().lower()
    fullname = request.form.get('fullname', username)

    if not username: return jsonify({'error': 'Tài khoản không được để trống'}), 400
    if not re.search('^[a-zA-Z0-9_]{6,29}$', username): 
      return jsonify({'error': 'Tài khoản chứa ký tự không hợp lệ hoặc nhỏ hơn 6 ký tự và lớn hơn 29 ký tự'}), 400
    if UserModel.objects(username=username).first(): return jsonify({'error': 'Tài khoản đã tồn tại'}), 400

    password = request.form['password']
    if not password: return jsonify({'error': 'Mật khẩu không được để trống'}), 400
    
    confirm = request.form['confirm']
    if password != confirm: return jsonify({'error': 'Mật khẩu không khớp'}), 400
    
    #Hash password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    #Save database
    user = UserModel(
      username=username,
      password=hashed.decode('utf-8'),
      fullname=fullname,
    )
    user.save()
    return jsonify(user), 200
  except:
    return jsonify({'error': 'Đã xảy ra lỗi'}), 400

@userRouter.route('/login', methods=['POST'])
def login():
  try:
    #Validate
    username = request.form['username'].strip().lower()
    fullname = request.form.get('fullname', username)
    if not username: return jsonify({'error': 'Tài khoản không được để trống'}), 400
    user = UserModel.objects(username=username).first()
    if not user: return jsonify({'error': 'Tài khoản không tồn tại'}), 400

    password = request.form['password']
    if not password: return jsonify({'error': 'Mật khẩu không được để trống'}), 400
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')): return jsonify({'error': 'Mật khẩu không chính xác'}), 400
    token = jwt.encode({
      'id': str(user.id),
      'username': user.username,
      'fullname': user.fullname,
      'exp' : datetime.utcnow() + timedelta(minutes = 30)
    }, os.getenv('SECRET_KEY'))
    return jsonify({'token': token}), 200
  except NameError:
    print(NameError)
    return jsonify({'error': 'Đã xảy ra lỗi'}), 400

#Api kiểm tra user
@userRouter.route('/auth', methods=['GET'])
@Auth
def checkUser():
  return request.username