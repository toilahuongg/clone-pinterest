from flask import Flask
from flask_cors import CORS
import os
from routes.userRouter import userRouter
from routes.collectionRouter import collectionRouter
from routes.roleRouter import roleRouter
from routes.pinRouter import pinRouter
from routes.commentRouter import commentRouter
from models import db
from seed import db_create, db_drop, db_reset, db_seed

app = Flask(__name__,static_url_path='', static_folder='static')
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URI')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
db.init_app(app)

app.register_blueprint(userRouter, url_prefix='/api/user')
app.register_blueprint(collectionRouter, url_prefix='/api/collection')
app.register_blueprint(roleRouter, url_prefix='/api/role')
app.register_blueprint(pinRouter, url_prefix='/api/pin')
app.register_blueprint(commentRouter, url_prefix='/api/comment')

#Command
if not os.getenv('FLASK_ENV') == 'production':
    app.cli.command('db_create')(db_create)
    app.cli.command('db_drop')(db_drop)
    app.cli.command('db_seed')(db_seed)
    app.cli.command('db_reset')(db_reset)
    
if __name__ == '__main__':
   app.run()