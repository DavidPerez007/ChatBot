from flask import Flask, render_template, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

@app.route('/')
def login():
    return render_template('login.html')