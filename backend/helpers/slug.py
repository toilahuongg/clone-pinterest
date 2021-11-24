import time
from slugify import slugify 
def slug(string):
  return slugify(string, to_lower=True)+'-'+str(round(time.time() * 1000))
