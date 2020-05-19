from flask_restx import Resource, Namespace, reqparse, fields, abort
# noinspection PyProtectedMember
from flask_restx._http import HTTPStatus
from flask_jwt_extended import jwt_required, current_user
from werkzeug.datastructures import FileStorage
from application.models import User as UserModel
from .api_models import pagination_model
from .parsers import paging_parser
from .users import user_model, user_parser

# Namespace

profile_ns = Namespace("Profile", description="Profile user information endpoint",
                       path="/profile", decorators=[jwt_required])

# Parsers

user_avatar_parser = reqparse.RequestParser()
user_avatar_parser.add_argument('avatar', type=FileStorage, location='files')

profile_parser = user_parser.copy()
profile_parser.remove_argument("is_active")

# Models

#

# Resources


@profile_ns.route('')
class UserProfile(Resource):
    @profile_ns.expect(profile_parser)
    @profile_ns.marshal_with(user_model)
    def patch(self):
        args = profile_parser.parse_args()
        current_user.update(**args)
        current_user.reload()
        return current_user

    @profile_ns.marshal_with(user_model)
    def get(self):
        return current_user


@profile_ns.route('/avatar')
class UserProfileAvatar(Resource):
    @profile_ns.expect(user_avatar_parser)
    def post(self):
        args = user_avatar_parser.parse_args()
        avatar = args["avatar"]
        current_user.avatar.save(avatar, overwrite=True)
        current_user.save()
        return {
            "message": "User profile avatar was successfully uploaded"
        }, 201
