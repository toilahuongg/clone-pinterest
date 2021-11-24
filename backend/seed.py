import os
from random import randrange

import lorem
import requests
from helpers.files import UPLOAD_FOLDER, optimizeFile, removeAllFile
from helpers.slug import slug

from models import db, Role, User, Collection, Pin
sizes = ['1600/900', '1600/1200', '1200/1600', '600/900', '1200/1000']
def db_drop():
    db.drop_all()
    removeAllFile()
    print('Database dropped!')
def db_create():
    db.create_all()
    print('Database created!')
def db_seed():
    listSeed = []
    roleAdmin = Role(
        name="Admin",
        value="admin"
    )
    listSeed.append(roleAdmin)
    roleMember = Role(
        name="Member",
        value="member"
    )
    listSeed.append(roleMember)
    
    userAdmin = User(
        username="admin",
        fullname="admin",
        password="$2b$12$RO5ip9d.uRNo6qgnAdboTe0ucmif5DrqfFhqFs0AiJ.oOwiO7sQby",
        email="admin@gmail.com",
        gender="male",
        role=roleAdmin
    )
    listSeed.append(userAdmin)
    
    userMember = User(
        username="member",
        fullname="member",
        password="$2b$12$RO5ip9d.uRNo6qgnAdboTe0ucmif5DrqfFhqFs0AiJ.oOwiO7sQby",
        email="member@gmail.com",
        gender="male",
        role=roleMember
    )
    listSeed.append(userMember)
    collection = Collection(
        title="Test",
        user_id=1,
        isPublic=True,
        slug="test",
    )
    listSeed.append(collection)
    for i in range(200):
      title = lorem.sentence()
      slg = slug(title)
      fileName = slg+'.jpg'
      filePath = os.path.join(UPLOAD_FOLDER, fileName)
      randomSize = sizes[randrange(0,len(sizes))]
      width = randomSize.split('/')[0]
      height = randomSize.split('/')[1]
      if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
      with open(filePath, 'wb') as handle:
          response = requests.get('https://picsum.photos/'+randomSize, stream=True)

          if not response.ok:
              print(response)

          for block in response.iter_content(1024):
              if not block:
                  break
              handle.write(block)
      optimizeFile(filePath)
      collection.pins.append(Pin(
          title=title,
          slug=slg,
          width=width,
          height=height,
          featuredImage=fileName,
          user_id=1,
          content=lorem.paragraph()
      ))
    db.session.add_all(listSeed)
    db.session.commit()
    print('Database seed!')
def db_reset():
    db_drop()
    db_create()
    db_seed()
    print('Database reset!')