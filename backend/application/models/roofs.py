from functools import reduce
from datetime import datetime
from mongoengine import StringField, FloatField, PointField, \
    ReferenceField, EmbeddedDocument, EmbeddedDocumentListField, DateTimeField
from application import db
from .users import User


class Comment(EmbeddedDocument):
    author = ReferenceField(User)
    rating = FloatField()
    text = StringField()
    date = DateTimeField(default=datetime.utcnow)


class Roof(db.Document):
    name = StringField(required=True, max_length=120)
    description = StringField()
    rating = FloatField(default=0.)
    location = PointField(required=True, auto_index=True)
    comments = EmbeddedDocumentListField(Comment, default=list)

    def __init__(self, *args, **kwargs):
        if "lat" in kwargs.keys() and "lng" in kwargs.keys():
            coords = [kwargs.pop("lat"), kwargs.pop("lng")]
            super().__init__(*args, **kwargs)
            self.location = coords
        else:
            super().__init__(*args, **kwargs)

    def update_rating(self):
        self.rating = reduce(lambda x, y: x + y.rating, self.comments, 0) / self.comments.count()