from werkzeug.security import generate_password_hash, check_password_hash
from application import db


class User(db.Document):
    username = db.StringField(required=True)
    password_hash = db.StringField(required=True)
    email = db.EmailField()
    name = db.StringField()
    is_active = db.BooleanField(default=True)

    def __init__(self, *args, **kwargs):
        if "password" in kwargs.keys():
            password = kwargs.pop("password")
            self.password = password
        super().__init__(*args, **kwargs)

    def update(self, *args, **kwargs):
        if "password" in kwargs.keys():
            password = kwargs.pop("password")
            self.update(password_hash=generate_password_hash(password))
        if kwargs:
            super().update(*args, **kwargs)

    @property
    def password(self):
        raise AttributeError("Error: Password is not readable attribute")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
