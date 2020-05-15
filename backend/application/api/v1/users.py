from flask import jsonify
from flask_restplus import Resource, Namespace, reqparse, fields, inputs, abort
from flask_restplus._http import HTTPStatus
from flask_jwt_extended import create_access_token, create_refresh_token, \
    jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt
from application import app, jwt
from application.models import User as UserModel
from .api_models import pagination_model
from .parsers import paging_parser

# Namespace

users_ns = Namespace("Users", description="Users endpoint", path="/users",
                     decorators=[jwt_required])

# Parsers

user_parser = reqparse.RequestParser()
user_parser.add_argument("username", type=str, location="json",
                         store_missing=False, help="Username of a user")
user_parser.add_argument("password", type=str, location="json",
                         store_missing=False, help="Password of a user")
user_parser.add_argument("email", type=inputs.email(), location="json",
                         store_missing=False, help="Email of a user")
user_parser.add_argument("name", type=str, location="json",
                         store_missing=False,
                         help="First or/and second name of a user")
user_parser.add_argument("is_active", type=bool, location="json", default=True,
                         store_missing=False, help="Active or disabled user")

post_user_parser = user_parser.copy()
post_user_parser.replace_argument("username", type=str, location="json",
                                  required=True, help="Username of a user")
post_user_parser.replace_argument("password", type=str, location="json",
                                  required=True, help="Password of a user")

# Models

user_model = users_ns.model("User", {
    "id": fields.String,
    "username": fields.String,
    "email": fields.String,
    "name": fields.String,
    "is_active": fields.Boolean,
})

users_model = users_ns.inherit("Users", pagination_model, {
    "users": fields.List(fields.Nested(user_model), attribute="items")
})

# Resources


@users_ns.route("/")
class Users(Resource):
    @users_ns.marshal_with(users_model)
    def get(self):
        args = paging_parser.parse_args()
        return UserModel.objects.paginate(page=args["page"],
                                          per_page=args["per_page"])

    @users_ns.marshal_with(user_model)
    @users_ns.expect(post_user_parser)
    def post(self):
        args = post_user_parser.parse_args()
        user = UserModel(**args)
        user.save()
        return user


@users_ns.route("/<id>")
@users_ns.doc(params={"id": "A machine ID"})
class User(Resource):
    @users_ns.marshal_with(user_model)
    @users_ns.response(HTTPStatus.NOT_FOUND,
                       HTTPStatus.NOT_FOUND.phrase)
    def get(self, id):
        return UserModel.objects.get_or_404(id=id)

    @users_ns.marshal_with(user_model)
    @users_ns.expect(user_parser)
    @users_ns.response(HTTPStatus.NOT_FOUND,
                       HTTPStatus.NOT_FOUND.phrase)
    def patch(self, id):
        args = user_parser.parse_args()
        user = UserModel.objects.get_or_404(id=id)
        print(args)
        user.update(**args)
        user.reload()
        return user

    @users_ns.response(HTTPStatus.NOT_FOUND,
                       HTTPStatus.NOT_FOUND.phrase)
    def delete(self, id):
        user = UserModel.objects.get_or_404(id=id)
        user.delete()
        return {
            "msg": "User was successfully deleted."
        }
