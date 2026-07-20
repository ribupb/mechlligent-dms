from flask import Flask

from config import Config

from models import db

from routes.auth import auth
from routes.workspace import workspace
from routes.dashboard import dashboard
from routes.project import project


app = Flask(__name__)

app.config.from_object(Config)

db.init_app(app)

app.register_blueprint(auth)
app.register_blueprint(workspace)
app.register_blueprint(dashboard)
app.register_blueprint(project)


with app.app_context():
    from models.user import User
    from models.project import Project
    from models.dataset_entry import DatasetEntry
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)