from flask_restplus import fields
from . import api

pagination_model = api.model("Pagination", {
    "has_next": fields.Boolean,
    "has_prev": fields.Boolean,
    "next_num": fields.Integer,
    "page": fields.Integer,
    "pages": fields.Integer,
    "per_page": fields.Integer,
    "prev_num": fields.Integer,
    "total": fields.Integer,
})
