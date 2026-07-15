from flask import Blueprint, render_template

project = Blueprint("project", __name__)

@project.route("/create-project")
def create_project():
    return render_template("create_project.html")