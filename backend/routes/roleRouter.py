from flask import Blueprint, jsonify

from models import Role
roleRouter = Blueprint('roleRouter', __name__)

@roleRouter.route('/', methods=['GET'])
def getRoles():
  roles = Role.query.all()
  return jsonify(roles),200