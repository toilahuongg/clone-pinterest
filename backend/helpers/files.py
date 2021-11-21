import time
import os
from PIL import Image
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'static/uploads'
def allowedFile(filename):
  return '.' in filename and \
    filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def uploadFile(file):
  if file and allowedFile(file.filename):
    filename = str(round(time.time() * 1000))+ '-' +secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    foo = Image.open(os.path.join(UPLOAD_FOLDER, filename))
    foo.save(os.path.join(UPLOAD_FOLDER, filename),optimize=True,quality=50)
    return filename
  
def removeFile(filename):
  if filename:
    path = os.path.join(UPLOAD_FOLDER, filename)
    print(path)
    if os.path.exists(path):
      os.remove(path)
  