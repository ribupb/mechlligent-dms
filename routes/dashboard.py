from flask import Blueprint, render_template
from utils.auth import login_required

dashboard = Blueprint("dashboard", __name__)

@dashboard.route("/dashboard")
@login_required

def dashboard_page():
    return render_template("dashboard.html")