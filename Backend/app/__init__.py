from dotenv import load_dotenv
load_dotenv()
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config
from app.models import db
from app.routes import register_routes

def create_app():
    app = Flask(__name__)
    CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

    
    app.config.from_object(Config)
    db.init_app(app)
    JWTManager(app)
    register_routes(app)
    
    return app