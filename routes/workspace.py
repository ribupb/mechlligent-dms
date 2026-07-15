from flask import Blueprint, render_template

workspace = Blueprint("workspace", __name__)

@workspace.route("/workspace")
def workspace_page():
    return render_template("workspace.html")