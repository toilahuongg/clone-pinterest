from flask import Flask
from flask import render_template
import dotenv
import os
print(os.getenv('VERSION'))
app = Flask(__name__)


@app.route("/")
def hello_world():
    return render_template("index.html")
