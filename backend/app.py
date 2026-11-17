import os
import json
from flask import Flask, request, render_template, redirect, url_for, jsonify
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

@app.route('/api', methods=['GET'])
def get_api_data():
    try:
        with open('data.json','r') as f:
            data = json.load(f)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    form_data = dict(request.form)
    try:
        MONGODB_URI = os.getenv('MONGODB_URI')
        client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
        db = client['DockerAssignmentDb']
        collection = db['Docker-Flask-assignment']
        collection.insert_one(form_data)
        client.close()
        return redirect(url_for('success_page'))
    except Exception as e:
        return render_template('index.html',error=f"DataBase Error: {str(e)}")

@app.route('/success')
def success_page():
    return render_template('success.html')

@app.route('/todo_item', methods=['GET'])
def todo_page():
    return render_template('todo.html')

@app.route('/submittodoitem', methods=['POST'])
def submittodoitem():
    form_data = dict(request.form)
    try:
        MONGODB_URI = os.getenv('MONGODB_URI')
        client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
        db = client['DockerAssignmentDb']
        collection = db['Docker-Git-assignment']
        collection.insert_one(form_data)
        client.close()
        return redirect(url_for('success_page'))
    except Exception as e:
        return render_template('todo.html',error=f"DataBase Error: {str(e)}")
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)