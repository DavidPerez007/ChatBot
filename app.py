from flask import Flask, make_response, render_template, request, jsonify
from flask_cors import CORS, cross_origin 
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from models import *
from google import genai
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
UPLOAD_FOLDER = 'uploads'
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
 
 
@app.route('/upload', methods=['POST'])
def upload_documents():
    processed_documents = []
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        uploaded_files = request.files.getlist('documents')
        print(f"Archivos recibidos: {len(uploaded_files)}")
        
        for file in uploaded_files:
            if file.filename:
                file_path = os.path.join(UPLOAD_FOLDER, file.filename)
                print(f"Guardando: {file.filename}")
                file.save(file_path) 
                processed_documents.append({
                    "original_name": file.filename,
                    "size": os.path.getsize(file_path),
                    "type": file.content_type,
                    "chunks": 0,
                    "status": "processed"
                })
        
        return jsonify({"message": "Files received",
                        "documents": processed_documents }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500
    
# @app.route('/delete/<int:doc_id>')
# def delete_documents(doc_id):
#     try:
#         # Aquí eliminas el documento de tu base de datos y sistema de embeddings
#         print(f"Deleting document with ID: {doc_id}")
        
#         # Simulamos eliminación exitosa
#         return jsonify({
#             "message": f"Document {doc_id} deleted successfully"
#         }), 200
        
#     except Exception as e:
#         return jsonify({"error": f"Delete failed: {str(e)}"}), 500