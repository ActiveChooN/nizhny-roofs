from flask_restx import Resource, Namespace, reqparse, fields
from flask_jwt_extended import jwt_required, current_user
from werkzeug.datastructures import FileStorage
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

profile_model = profile_ns.model("Profile", {
    "email": fields.String,
    "first_name": fields.String,
    "last_name": fields.String,
    "avatar": fields.String(attribute=lambda x: x.avatar.url),
    "followed": fields.List(fields.Nested({
        "id": fields.String,
        "first_name":  fields.String,
        "last_name": fields.String,
        "avatar": fields.String,
    }))
})

# Resources


@profile_ns.route('')
class UserProfile(Resource):
    @profile_ns.expect(profile_parser)
    @profile_ns.marshal_with(profile_model)
    def patch(self):
        args = profile_parser.parse_args()
        current_user.update(**args)
        current_user.reload()
        return current_user

    @profile_ns.marshal_with(profile_model)
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
