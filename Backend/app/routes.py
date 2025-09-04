from flask import request, jsonify
from flask_restful import Resource, Api
from flask import make_response
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_refresh_cookies,
    unset_jwt_cookies
)
from app.models import db, User

def register_routes(app):
    api = Api(app)

    class Register(Resource):
        def post(self):
            data = request.get_json()

            if User.query.filter_by(username=data['username']).first():
                return {'message': 'Username already exists'}, 400
            if User.query.filter_by(email=data['email']).first():
                return {'message': 'Email already exists'}, 400

            user = User(username=data['username'], email=data['email'])
            user.set_password(data['password'])
            db.session.add(user)
            db.session.commit()
            return {'message': 'User registered'}, 201

    class Login(Resource):
        def post(self):
            data = request.get_json()
            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return {"message": "Username and password required"}, 400

            user = User.query.filter_by(username=username).first()

            if user and user.check_password(password):
                access_token = create_access_token(identity=user.username)
                refresh_token = create_refresh_token(identity=user.username)

                # Send refresh token via HttpOnly cookie
                resp = jsonify({
                    "access_token": access_token,
                    "username": user.username,
                    "email": user.email
                })
                set_refresh_cookies(resp, refresh_token)
                return resp

            return {"message": "Invalid credentials"}, 401

    
    class Refresh(Resource):
        @jwt_required(refresh=True)
        def post(self):
            identity = get_jwt_identity()
            new_access_token = create_access_token(identity=identity)
            return jsonify({"access_token": new_access_token})

    class Logout(Resource):
        def post(self):
            resp = jsonify({"message": "Logged out"})
            unset_jwt_cookies(resp)
            return resp

    class Protected(Resource):
        @jwt_required()
        def get(self):
            return {'message': 'You are logged in'}

    api.add_resource(Register, '/register')
    api.add_resource(Login, '/login')
    api.add_resource(Refresh, '/refresh')
    api.add_resource(Logout, '/logout')
    api.add_resource(Protected, '/protected')
