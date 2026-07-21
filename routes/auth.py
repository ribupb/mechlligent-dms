from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models.user import User

auth = Blueprint("auth", __name__)

@auth.route("/", methods=["GET", "POST"])
def login():
    
    if "user_id" in session:
        return redirect(url_for("workspace.workspace_page"))

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]
        remember = "remember" in request.form

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            session.permanent = remember

            session["user_id"] = user.id
            session["username"] = user.username
            session["full_name"] = user.full_name

            return redirect(url_for("workspace.workspace_page"))

        flash("Invalid username or password.", "danger")

    return render_template("login.html")


@auth.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("auth.login"))