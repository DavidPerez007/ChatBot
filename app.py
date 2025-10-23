from flask import Flask, make_response, render_template, request, jsonify
from flask_cors import CORS, cross_origin 
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from models import *
from google import genai
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
db.init_app(app)

@app.route('/', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    existing_user = User.query.filter_by(email=email).first()
     
    if existing_user:
        if check_password_hash(existing_user.password_hash, password):
            return jsonify({"message": "Login exitoso", "token": "abc123"})
    return jsonify({"message": "Credenciales incorrectas"}), 401



@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(email, password)
    
    existing_user = User.query.filter_by(email=email).first()  
    
    if existing_user:
        return jsonify({"message": "El usuario ya existe"}), 400

    user = User(
        email=email,
        password_hash=generate_password_hash(password)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Cuenta creada correctamente"}), 201

@app.route('/chat', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def chat():
    data = request.get_json()
    message = data.get('message')
    api_key = os.getenv('API_KEY')
    client = genai.Client(api_key=api_key)
    print(message)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=message,
    )        
        
    
    return jsonify({"response": response.text})
    