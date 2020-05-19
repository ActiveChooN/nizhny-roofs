import os
from flask import Blueprint, render_template, url_for
from flask_restx import Api

blueprint = Blueprint("api", __name__)
api = Api(blueprint, version="1.0", title="Template Flask App", doc="/swagger",
          description="Template flask application with REST-API")

from . import main, api_models
from .auth import auth_ns
from .users import users_ns
from .roofs import roofs_ns
from .register import register_ns
from .profile import profile_ns

api.add_namespace(auth_ns)
api.add_namespace(users_ns)
api.add_namespace(roofs_ns)
api.add_namespace(register_ns)
api.add_namespace(profile_ns)
