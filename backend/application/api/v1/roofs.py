import os
import binascii
from flask_restx import Resource, Namespace, reqparse, fields
# noinspection PyProtectedMember
from flask_restx._http import HTTPStatus
from flask_jwt_extended import jwt_required, current_user
from werkzeug.datastructures import FileStorage
from application.models import Roof as RoofModel, RoofImage as RoofImageModel

# Namespace

roofs_ns = Namespace("Roofs", description="Roofs endpoint", path="/roofs")

# Parsers

roof_parser = reqparse.RequestParser()
roof_parser.add_argument("name", type=str, location="json", store_missing=False,
                         help="Name of the roof")
roof_parser.add_argument("description", type=str, location="json", store_missing=False,
                         help="Short description of the roof")
roof_parser.add_argument("lat", type=float, location="json", store_missing=False,
                         help="Latitude of the roof")
roof_parser.add_argument("lng", type=float, location="json", store_missing=False,
                         help="Longitude of the roof")

post_roof_parser = roof_parser.copy()
post_roof_parser.replace_argument("name", type=str, location="json", required=True,
                                  help="Name of the roof")
post_roof_parser.replace_argument("lat", type=float, location="json", required=True,
                                  help="Latitude of the roof")
post_roof_parser.replace_argument("lng", type=float, location="json", required=True,
                                  help="Longitude of the roof")

post_comment_parser = reqparse.RequestParser()
post_comment_parser.add_argument("rating", type=float, location="json", required=True,
                                 help="Five star rating of the roof comment")
post_comment_parser.add_argument("text", type=str, location="json", store_missing=False,
                                 help="Comment text")

roof_image_parser = reqparse.RequestParser()
roof_image_parser.add_argument('image', type=FileStorage, location='files')

# TODO: coord parser

# Models

comment_model = roofs_ns.model("Roof Comment", {
    "author_name": fields.String(attribute=lambda x: f"{x.author.first_name} {x.author.last_name     or ''}".rstrip()),
    "author_avatar": fields.String(attribute=lambda x: x.author.avatar),
    "rating": fields.Float,
    "text": fields.String,
    "date": fields.String,
})

roof_model = roofs_ns.model("Roof", {
    "id": fields.String,
    "name": fields.String,
    "description": fields.String,
    "rating": fields.Float,
    "lat": fields.Float(attribute=lambda x: x.location["coordinates"][0]),
    "lng": fields.Float(attribute=lambda x: x.location["coordinates"][1]),
    "thumbnail": fields.String(attribute=lambda x: (len(x.images) and x.images[0].image.best_url(200)) or ""),
    "comments": fields.List(fields.Nested(comment_model))
})

roofs_model = roofs_ns.model("Roofs", {
    "roofs": fields.List(fields.Nested(roof_model))
})

# Resources


@roofs_ns.route("")
class Roofs(Resource):
    @roofs_ns.marshal_with(roofs_model)
    def get(self):
        return {"roofs": RoofModel.objects}

    @jwt_required
    @roofs_ns.expect(post_roof_parser)
    @roofs_ns.marshal_with(roof_model)
    def post(self):
        args = post_roof_parser.parse_args()
        roof: RoofModel = RoofModel(**args)
        return roof.save()


# noinspection PyUnresolvedReferences
@roofs_ns.route("/<roof_id>")
class Roof(Resource):
    @roofs_ns.marshal_with(roof_model)
    @roofs_ns.response(HTTPStatus.NOT_FOUND, HTTPStatus.NOT_FOUND.phrase)
    def get(self, roof_id):
        return Roof.objects.get_or_404(id=roof_id)

    @jwt_required
    @roofs_ns.marshal_with(roof_model)
    @roofs_ns.expect(roof_parser)
    @roofs_ns.response(HTTPStatus.NOT_FOUND, HTTPStatus.NOT_FOUND.phrase)
    def patch(self, roof_id):
        args = roof_parser.parse_args()
        roof: RoofModel = RoofModel.objects.get_or_404(id=roof_id)
        roof.update(**args)
        roof.reload()
        return roof

    @jwt_required
    @roofs_ns.response(HTTPStatus.NOT_FOUND, HTTPStatus.NOT_FOUND.phrase)
    def delete(self, roof_id):
        roof = RoofModel.objects.get_or_404(id=roof_id)
        roof.delete()
        return {
            "message": "User was successfully deleted."
        }


# noinspection PyUnresolvedReferences
@roofs_ns.route("/<roof_id>/comment")
class RoofComment(Resource):
    @jwt_required
    @roofs_ns.expect(post_comment_parser)
    @roofs_ns.marshal_with(roof_model)
    def post(self, roof_id):
        args = post_comment_parser.parse_args()
        roof: RoofModel = RoofModel.objects.get_or_404(id=roof_id)
        roof.comments.create(author=current_user.id, **args)
        roof.update_rating()
        return roof.save()


# noinspection PyUnresolvedReferences
@roofs_ns.route("/<roof_id>/images")
class RoofImages(Resource):
    @jwt_required
    @roofs_ns.expect(roof_image_parser)
    def post(self, roof_id):
        args = roof_image_parser.parse_args()
        image_file = args["image"]
        image_file.filename = "{}.{}.{}".format(
            '.'.join(image_file.filename.split('.')[:-1]),
            binascii.b2a_hex(os.urandom(4)).decode(),
            image_file.filename.split('.')[-1]
        )
        roof = RoofModel.objects.get_or_404(id=roof_id)
        image = RoofImageModel(uploaded_by=current_user.id)
        image.image.save(args["image"])
        image.save()
        roof.update(push__images=image)
        return {
            "message": "Roof image was successfully uploaded"
        }, HTTPStatus.CREATED

