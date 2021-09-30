from flask import Flask
from flask import render_template
from pymongo import MongoClient

import os
from routes.userRouter import userRouter
from models import db

app = Flask(__name__)
app.config["MONGODB_SETTINGS"] = {
    'host': os.getenv('MONGO_HOST'),
}
db.init_app(app)

app.register_blueprint(userRouter, url_prefix='/api/user')
@app.route("/")
def hello_world():
    return render_template("index.html")
if __name__ == '__main__':
   app.run()