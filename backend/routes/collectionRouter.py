from datetime import datetime, timedelta
from flask import Blueprint, json, Response, request, jsonify
import re, bcrypt, jwt, os
from models import User, Role, AlchemyEncoder, db
from middlewares import Auth, Admin

collectionRouter = Blueprint('collectionRouter', __name__)

@collectionRouter.route('/<userId>', methods=["GET"])
def getByUser(userId):
  print(userId)
  return 'ok'