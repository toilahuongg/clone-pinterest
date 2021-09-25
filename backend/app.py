from flask import Flask
from flask import render_template
import dotenv
import os
app = Flask(__name__)


print(f"VERSION {os.getenv('VERSION')}")
@app.route("/")
def hello_world():
    return render_template("index.html")
if __name__ == '__main__':
   app.run()