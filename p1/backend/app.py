from flask import Flask, request, jsonify
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('../../.env')
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Initialize Flask app
app = Flask(__name__)

@app.route("/")
def home():
    return "Flask + Supabase API is running!"

# User Sign-up
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    response = supabase.auth.sign_up({"email": email, "password": password})

    if "error" in response:
        return jsonify({"error": response["error"]["message"]}), 400

    return jsonify({"message": "User signed up successfully", "user": response})

# User Login
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    response = supabase.auth.sign_in_with_password({"email": email, "password": password})

    if "error" in response:
        return jsonify({"error": response["error"]["message"]}), 400

    return jsonify({"message": "User logged in successfully", "session": response})

# Fetch all users (Admin Only)
@app.route("/users", methods=["GET"])
def get_users():
    response = supabase.table("users").select("*").execute()
    return jsonify(response.data)

# Insert user manually into Supabase
@app.route("/users", methods=["POST"])
def add_user():
    data = request.get_json()
    response = supabase.table("users").insert(data).execute()
    return jsonify(response.data)

if __name__ == "__main__":
    app.run(debug=True)
