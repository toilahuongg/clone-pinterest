from flask import Flask
from flask import render_template

import os
from routes.userRouter import userRouter
from routes.collectionRouter import collectionRouter
from models import db, Role

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URI')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
db.init_app(app)

# with app.app_context():
#     db.create_all()

app.register_blueprint(userRouter, url_prefix='/api/user')
app.register_blueprint(collectionRouter, url_prefix='/api/collection')
@app.route("/")
def hello_world():
    return render_template("index.html")

#Command 
@app.cli.command('db_create')
def db_create():
    db.create_all()
    print('Database created!')

@app.cli.command('db_drop')
def db_drop():
    db.drop_all()
    print('Database dropped!')

@app.cli.command('db_seed')
def db_seed():
    db.session.add_all([
        Role(
            name="Admin",
            value="admin"
        ),
        Role(
            name="Member",
            value="member"
        ),
    ])
    db.session.commit()
    print('Database seed!')

if __name__ == '__main__':
   app.run()