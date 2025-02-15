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

    # Handle sign-up error
    if "error" in response:
        return jsonify({"error": response["error"]["message"]}), 400

    return jsonify({
        "message": "User signed up successfully",
        "user": {
            "id": response.user.id,
            "email": response.user.email,
            "created_at": response.user.created_at
        }
    }), 201

# User Login
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    response = supabase.auth.sign_in_with_password({"email": email, "password": password})

    # Handle error response
    if response.user is None:
        return jsonify({"error": response.error.message}), 400

    return jsonify({
        "message": "User logged in successfully",
        "session": {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at
            }
        }
    }), 200

# Fetch all users (Admin Only)
@app.route("/users", methods=["GET"])
def get_users():
    response = supabase.table("users").select("*").execute()

    # Handle possible error
    if "error" in response:
        return jsonify({"error": response["error"]["message"]}), 400

    return jsonify({
        "users": [
            {
                "id": user["id"],
                "email": user["email"],
                "created_at": user["created_at"]
            }
            for user in response.data
        ]
    }), 200

# Insert user manually into Supabase
@app.route("/users", methods=["POST"])
def add_user():
    data = request.get_json()
    response = supabase.table("users").insert(data).execute()

    # Handle possible error
    if "error" in response:
        return jsonify({"error": response["error"]["message"]}), 400

    return jsonify({
        "message": "User added successfully",
        "user": {
            "id": response.data[0]["id"],
            "email": response.data[0]["email"],
            "created_at": response.data[0]["created_at"]
        }
    }), 201

# User Logout
@app.route("/logout", methods=["POST"])
def logout():
    data = request.get_json()
    access_token = data.get("access_token")

    if not access_token:
        return jsonify({"error": "Access token is required"}), 400

    response = supabase.auth.sign_out()

    if response:
        return jsonify({"message": "User logged out successfully"}), 200
    else:
        return jsonify({"error": "Logout failed"}), 400


if __name__ == "__main__":
    app.run(debug=True)