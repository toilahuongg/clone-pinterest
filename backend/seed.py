import os
from random import randrange
import time
import lorem
import requests
from helpers.files import UPLOAD_FOLDER, optimizeFile, removeAllFile
from helpers.slug import slug

from models import db, Role, User, Collection, Pin
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    
sizes = ['1600/900', '1600/1200', '1200/1600', '600/900', '1200/1000']
def db_drop():
    db.drop_all()
    removeAllFile()
    print('Database dropped!')
def db_create():
    db.create_all()
    print('Database created!')
def db_seed():
    start = time.time()
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
    collection1 = Collection(
        title="Test",
        user_id=1,
        isPublic=True,
        slug="test",
    )
    listSeed.append(collection1)
    collection2 = Collection(
        title="Test 2",
        user_id=2,
        isPublic=True,
        slug="test-2",
    )
    listSeed.append(collection2)
    for i in range(1000):
        title = lorem.sentence()
        print(f"{bcolors.OKCYAN}Đang tạo pin {i}: {bcolors.BOLD}{title}{bcolors.ENDC}")
        slg = slug(title)
        fileName = slg+'.jpg'
        filePath = os.path.join(UPLOAD_FOLDER, fileName)
        randomSize = sizes[randrange(0,len(sizes))]
        width = randomSize.split('/')[0]
        height = randomSize.split('/')[1]
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        try:
            with open(filePath, 'wb') as handle:
                response = requests.get('https://picsum.photos/'+randomSize, stream=True)

                if not response.ok:
                    print(response)

                for block in response.iter_content(1024):
                    if not block:
                        break
                    handle.write(block)
            optimizeFile(filePath)
        except:
            print(f"{bcolors.FAIL}Đã xảy ra lỗi{bcolors.ENDC}")
        rand = randrange(0,2)
        if (rand == 0):
            collection1.pins.append(Pin(
                title=title,
                slug=slg,
                width=width,
                height=height,
                featuredImage=fileName,
                user_id=1,
                content=lorem.paragraph()
            ))
        else:
            collection2.pins.append(Pin(
                title=title,
                slug=slg,
                width=width,
                height=height,
                featuredImage=fileName,
                user_id=2,
                content=lorem.paragraph()
            ))
            
        print(f"Trạng thái pin {i}: {bcolors.OKGREEN}Success{bcolors.ENDC}\n")
    db.session.add_all(listSeed)
    db.session.commit()
    end = time.time()
    print('Database seed!')
    print(f'{bcolors.OKBLUE}Time: {bcolors.OKGREEN} {"{:.2f}s".format(end-start)}{bcolors.ENDC}')
def db_reset():
    db_drop()
    db_create()
    db_seed()
    print(f'{bcolors.OKGREEN}Database reset!{bcolors.ENDC}')