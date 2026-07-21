from app import app
from models import db
from models.user import User

with app.app_context():

    users = [
        {
            "full_name": "Ribu",
            "username": "ribu",
            "password": "ribu123"
        },
        {
            "full_name": "John",
            "username": "john",
            "password": "john123"
        },
        {
            "full_name": "Gopika",
            "username": "gopika",
            "password": "gopika123"
        }
    ]

    for data in users:

        # Skip if user already exists
        if User.query.filter_by(username=data["username"]).first():
            print(f"{data['username']} already exists.")
            continue

        user = User(
            full_name=data["full_name"],
            username=data["username"]
        )

        user.set_password(data["password"])

        db.session.add(user)

    db.session.commit()

    print("Users created successfully!")