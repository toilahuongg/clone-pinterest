import os
from random import randrange
import requests, lorem
from helpers.files import UPLOAD_FOLDER, optimizeFile
from models import db, Pin
from helpers import slug
listSeed = []
randomSize = ['1600/900', '400/300', '300/400', '600/900', '600/500']
for i in range(200):
  title = lorem.sentence()
  slg = slug(title)
  fileName = slg+'.jpg'
  filePath = os.path.join(UPLOAD_FOLDER, fileName)
  size = randomSize[randrange(0,len(randomSize))]
  with open(filePath, 'wb') as handle:
      response = requests.get('https://picsum.photos/'+size, stream=True)

      if not response.ok:
          print(response)

      for block in response.iter_content(1024):
          if not block:
              break
          handle.write(block)
  optimizeFile(filePath)
  listSeed.append(Pin(
      title=title,
      slug=slg,
      width=size.split('/')[0],
      height=size.split('/')[1],
      featuredImage=fileName,
      user_id=1,
      content=lorem.paragraph()
  ))
db.session.add_all(listSeed)
db.session.commit()