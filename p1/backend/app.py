from flask import Flask, request, jsonify
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pathlib import Path
import datetime

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
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    job_title = data.get("job_title")
    phone_number = data.get("phone_number")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Step 1: Create the user in Supabase authentication system
    response = supabase.auth.sign_up({"email": email, "password": password})

    if "error" in response:
        return jsonify({"error": response["error"]["message"]}), 400

    # Step 2: Insert the user profile data into the user_profile.users table
    user_id = response.user.id  # Get the Supabase user ID
    created_at = datetime.datetime.now(datetime.UTC).isoformat()

    user_profile_data = {
        "user_id": user_id,
        "first_name": first_name,
        "last_name": last_name,
        "job_title": job_title,
        "created_at": created_at,
        "email": email,
        "phone_number": phone_number
    }

    # Insert the new user profile into the database
    profile_response = supabase.table("user_profile").insert(user_profile_data).execute()

    # Check if the insert was successful
    if "error" in profile_response:
        return jsonify({"error": profile_response["error"]["message"]}), 400

    return jsonify({
        "message": "User signed up successfully",
        "user": {
            "id": response.user.id,
            "email": response.user.email,
            "created_at": response.user.created_at
        },
        "profile": {
            "user_id": user_id,
            "first_name": first_name,
            "last_name": last_name,
            "job_title": job_title
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

# Fetch user profile by user_id
@app.route("/user_profile", methods=["GET"])
def get_user_profile():
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Fetch the user profile from the user_profile table
    response = supabase.table("user_profile").select("*").eq("user_id", user_id).execute()

    # Handle possible error
    if "error" in response:
        return jsonify({"error": response["error"]["message"]}), 400

    # If no data is found, return an appropriate message
    if not response.data:
        return jsonify({"error": "User profile not found"}), 404

    return jsonify({
        "user_profile": response.data[0]
    }), 200

# Fetch user profile by user_id
@app.route("/match_job", methods=["POST"])
def match_job():
    user_id = request.args.get('user_id')
    job_id = request.args.get('job_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    if not job_id:
        return jsonify({"error": "Job ID is required"}), 400
    
    existing_match = supabase.table("job_matching").select("*").eq("user_id", user_id).eq("job_id", job_id).execute()

    if existing_match.data:  # If a match already exists
        return jsonify({"message": "Job already matched"}), 400
    
    job_match_insert = {
        "user_id":user_id,
        "job_id": job_id
    }

    response = supabase.table("job_matching").insert(job_match_insert).execute()
    
    if "error" in response:
        return jsonify({"error": response["error"]["message"]}), 400
    
    return jsonify({
        "match_job": response.data[0]
    }), 200


if __name__ == "__main__":
    app.run(debug=True)