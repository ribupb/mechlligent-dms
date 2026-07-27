import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:

    SECRET_KEY = os.getenv("SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # -----------------------------------------
    # Database connection stability
    # -----------------------------------------
    SQLALCHEMY_ENGINE_OPTIONS = {
        # Check that a pooled connection is alive before using it.
        # Dead connections are discarded and replaced automatically.
        "pool_pre_ping": True,

        # Don't keep the same pooled connection around indefinitely.
        "pool_recycle": 300,

        # Number of persistent connections available to the app.
        "pool_size": 5,

        # Temporary extra connections allowed during higher activity.
        "max_overflow": 10,

        # How long to wait for a connection from the pool.
        "pool_timeout": 30,
    }

    PERMANENT_SESSION_LIFETIME = timedelta(days=365)