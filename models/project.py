from datetime import datetime

from models import db


class Project(db.Model):

    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)

    project_name = db.Column(db.String(200), nullable=False)

    description = db.Column(db.Text)

    template_excel_path = db.Column(db.String(500))

    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    
    status = db.Column(
    db.String(30),
    nullable=False,
    default="New"
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    

    def __repr__(self):
        return f"<Project {self.project_name}>"