import time
import os
from flask import current_app
from PIL import Image
from werkzeug.utils import secure_filename
import shutil

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'static/uploads'
def allowedFile(filename):
  return '.' in filename and \
    filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def optimizeFile(filePath):
  foo = Image.open(filePath)
  foo.save(filePath,optimize=True,quality=50) 
  
def uploadFile(file):
  dir = os.path.dirname(os.path.dirname(__file__))
  folder = UPLOAD_FOLDER.replace('/', '\\')
  path = os.path.join(dir, folder)
  if not os.path.exists(path):
    os.makedirs(path)
  if file and allowedFile(file.filename):
    filename = str(round(time.time() * 1000))+ '-' +secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    optimizeFile(os.path.join(UPLOAD_FOLDER, filename))
    return filename

def removeFile(filename):
  if filename:
    path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(path):
      os.remove(path)

def removeAllFile():
  dir = os.path.dirname(os.path.dirname(__file__))
  folder = UPLOAD_FOLDER.replace('/', '\\')
  path = os.path.join(dir, folder)
  if os.path.exists(path):
      shutil.rmtree(path, ignore_errors=True)