import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
import google.generativeai as genai
from pathlib import Path
import whisper
from gtts import gTTS
from io import BytesIO
import tempfile

# Load environment variables from .env
dotenv_path = Path('../../.env')
load_dotenv()

# Retrieve your Google Gemini API key from environment variables
GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")

# Configure Google Gemini
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the Whisper model (CPU only)
device = "cpu"
whisper_model = whisper.load_model("base").to(device)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/speech-to-text", methods=["POST"])
def speech_to_text():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file found in the request"}), 400

    audio_file = request.files["audio"]
    if audio_file.filename == "":
        return jsonify({"error": "No filename provided"}), 400

    # Save to a temporary file
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        tmp.write(audio_file.read())
        tmp_path = tmp.name

    # Now transcribe using the temp file path
    result = whisper_model.transcribe(tmp_path, fp16=False)
    text = result.get("text", "")

    return jsonify({"transcript": text})

# Endpoint 2: Google Gemini AI (Processes Response & Generates Feedback)
@app.route("/interview", methods=["POST"])
def interview():
    """
    Expects JSON with "question" and "response" fields.
    Returns a JSON object with "feedback" from Gemini.
    """
    data = request.json
    question = data.get("question")
    user_response = data.get("response")

    prompt = (
        f"Interview question: {question}\n"
        f"User's response: {user_response}\n"
        "respond normal"
    )
    gemini_response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
    
    # Adjust if needed based on the actual response format
    feedback = gemini_response.text

    return jsonify({"feedback": feedback})

# Endpoint 3: gTTS Text-to-Speech 
@app.route("/text-to-speech", methods=["POST"])
def text_to_speech():
    """
    Expects JSON with "text" to be spoken. Returns an MP3 file as audio/mpeg.
    """
    data = request.json
    text_to_speak = data.get("text", "")
    
    if not text_to_speak:
        return jsonify({"error": "No text provided"}), 400

    tts = gTTS(text=text_to_speak, lang="en")
    
    # Use an in-memory buffer so we don't write to disk (optional).
    mp3_buffer = BytesIO()
    tts.write_to_fp(mp3_buffer)
    mp3_buffer.seek(0)

    # Return as an audio file
    return send_file(
        mp3_buffer,
        as_attachment=False,
        download_name="tts_output.mp3",
        mimetype="audio/mpeg"
    )

if __name__ == "__main__":
    app.run(debug=True)
