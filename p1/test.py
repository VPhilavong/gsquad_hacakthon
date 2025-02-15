from flask import Flask, request, jsonify
from supabase import create_client, Client
import os

# Load environment variables (or set manually)
SUPABASE_URL = "https://your-supabase-url.supabase.co"
SUPABASE_KEY = "your-supabase-anon-key"

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Flask app
app = Flask(__name__)

@app.route("/")
def home():
    return "Flask + Supabase API is running!"

# Example: Fetch data from Supabase
@app.route("/users", methods=["GET"])
def get_users():
    response = supabase.table("users").select("*").execute()
    return jsonify(response.data)

# Example: Insert data into Supabase
@app.route("/users", methods=["POST"])
def add_user():
    data = request.get_json()
    response = supabase.table("users").insert(data).execute()
    return jsonify(response.data)

if __name__ == "__main__":
    app.run(debug=True)
