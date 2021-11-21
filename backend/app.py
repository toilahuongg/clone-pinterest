from flask import Flask
from flask import render_template
from flask_cors import CORS

import os
from routes.userRouter import userRouter
from routes.collectionRouter import collectionRouter
from routes.roleRouter import roleRouter
from routes.pinRouter import pinRouter
from models import User, db, Role

app = Flask(__name__,static_url_path='', static_folder='static', template_folder='templates')
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URI')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
db.init_app(app)

# with app.app_context():
#     db.create_all()

app.register_blueprint(userRouter, url_prefix='/api/user')
app.register_blueprint(collectionRouter, url_prefix='/api/collection')
app.register_blueprint(roleRouter, url_prefix='/api/role')
app.register_blueprint(pinRouter, url_prefix='/api/pin')
@app.route("/")
def hello_world():
    return render_template("index.html")

#Command
if not os.getenv('FLASK_ENV') == 'production':
    def db_drop():
        db.drop_all()
        print('Database dropped!')
    def db_create():
        db.create_all()
        print('Database created!')
    def db_seed():
        roleAdmin = Role(
            name="Admin",
            value="admin"
        )
        roleMember = Role(
            name="Member",
            value="member"
        )
        userAdmin = User(
            username="admin",
            fullname="admin",
            password="$2b$12$RO5ip9d.uRNo6qgnAdboTe0ucmif5DrqfFhqFs0AiJ.oOwiO7sQby",
            email="admin@gmail.com",
            gender="male",
            role=roleAdmin
        )
        userMember = User(
            username="member",
            fullname="member",
            password="$2b$12$RO5ip9d.uRNo6qgnAdboTe0ucmif5DrqfFhqFs0AiJ.oOwiO7sQby",
            email="member@gmail.com",
            gender="male",
            role=roleMember
        )

        db.session.add_all([
            roleAdmin,
            roleMember,
            userAdmin,
            userMember,
        ])
        db.session.commit()
        print('Database seed!')
    def db_reset():
        db_drop()
        db_create()
        db_seed()
        print('Database reset!')
        
    app.cli.command('db_create')(db_create)
    app.cli.command('db_drop')(db_drop)
    app.cli.command('db_seed')(db_seed)
    app.cli.command('db_reset')(db_reset)
    
if __name__ == '__main__':
   app.run()