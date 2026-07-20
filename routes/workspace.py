from flask import Blueprint, render_template

from models.project import Project

workspace = Blueprint("workspace", __name__)


@workspace.route("/workspace")
def workspace_page():

    projects = Project.query.order_by(Project.created_at.desc()).all()

    total_projects = Project.query.count()

    completed_projects = Project.query.filter_by(
        status="Completed"
    ).count()

    active_projects = total_projects - completed_projects

    return render_template(
        "workspace.html",
        projects=projects,
        total_projects=total_projects,
        completed_projects=completed_projects,
        active_projects=active_projects
    )