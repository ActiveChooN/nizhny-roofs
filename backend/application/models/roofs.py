from functools import reduce
from datetime import datetime
from mongoengine import StringField, FloatField, PointField, ListField, \
    ReferenceField, EmbeddedDocument, EmbeddedDocumentListField, DateTimeField
from flask_fs.mongo import ImageField
from application import db, storages
from .users import User


class Comment(EmbeddedDocument):
    author = ReferenceField(User)
    rating = FloatField()
    text = StringField()
    date = DateTimeField(default=datetime.utcnow)


class RoofImage(db.Document):
    image = ImageField(fs=storages["avatars"], max_size=2000, thumbnails=[200])
    date = DateTimeField(default=datetime.utcnow)
    uploaded_by = ReferenceField(User)


class Roof(db.Document):
    name = StringField(required=True, max_length=120)
    description = StringField()
    rating = FloatField(default=0.)
    location = PointField(required=True, auto_index=True)
    comments = EmbeddedDocumentListField(Comment, default=list)
    images = ListField(ReferenceField(RoofImage), default=list)

    def __init__(self, *args, **kwargs):
        if "lat" in kwargs.keys() and "lng" in kwargs.keys():
            coords = [kwargs.pop("lat"), kwargs.pop("lng")]
            super().__init__(*args, **kwargs)
            self.location = coords
        else:
            super().__init__(*args, **kwargs)

    def update_rating(self):
        self.rating = reduce(lambda x, y: x + y.rating, self.comments, 0) / self.comments.count()