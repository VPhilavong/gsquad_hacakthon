import React, { useState, useRef } from "react";
import './Interview.css';
function InterviewAI() {
  const [question, setQuestion] = useState("");
  const [feedback, setFeedback] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Request permission and setup the MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      // On receiving audio data
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // When recording stops, handle the audio
      mediaRecorderRef.current.onstop = handleStop;

      mediaRecorderRef.current.start();
      setRecordingStatus("recording");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setRecordingStatus("error");
    }
  };

  // Stop recording and let onstop trigger handleStop
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecordingStatus("processing");
    }
  };

  // Handle the audio once recording is done
  const handleStop = async () => {
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];

    // 1) Send audio to speech-to-text
    let transcript = "";
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const sttResponse = await fetch("http://localhost:5000/speech-to-text", {
        method: "POST",
        body: formData,
      });
      const sttData = await sttResponse.json();
      transcript = sttData.transcript || "";
      console.log("Transcript:", transcript);
    } catch (err) {
      console.error("Error calling /speech-to-text:", err);
      setRecordingStatus("error");
      return;
    }

    // 2) Send question + transcript to /interview
    let geminiFeedback = "";
    try {
      const interviewResponse = await fetch("http://localhost:5000/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question || "No specific question given.",
          response: transcript,
        }),
      });
      const interviewData = await interviewResponse.json();
      geminiFeedback = interviewData.feedback || "";
      console.log("Gemini Feedback:", geminiFeedback);
      setFeedback(geminiFeedback);
    } catch (err) {
      console.error("Error calling /interview:", err);
      setRecordingStatus("error");
      return;
    }

    // 3) Convert feedback to speech via /text-to-speech
// 3) Convert feedback to speech via /text-to-speech
try {
    const ttsResponse = await fetch("http://localhost:5000/text-to-speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: geminiFeedback }),
    });
    const ttsBlob = await ttsResponse.blob();
    const audioURL = URL.createObjectURL(ttsBlob);
  
    // Attempt to auto-play
    const audio = new Audio(audioURL);
    audio.play().catch(err => {
      console.warn("Auto-play failed, possibly due to browser autoplay policies.", err);
    });
  
    // If you also want to display an <audio> element for playback controls, set a state variable:
    setAudioSrc(audioURL);
  
  } catch (err) {
    console.error("Error calling /text-to-speech:", err);
    setRecordingStatus("error");
    return;
  }
  

    setRecordingStatus("done");
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Interview AI</h1>

      <div style={{ marginBottom: 10 }}>
        <label>Interview Question: </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <button onClick={startRecording} disabled={recordingStatus === "recording"}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={recordingStatus !== "recording"}>
          Stop Recording
        </button>
      </div>

      <p>Status: {recordingStatus}</p>

      <div style={{ marginTop: 20 }}>
        <h3>AI Feedback:</h3>
        <p>{feedback}</p>
      </div>

    </div>
  );
}

export default InterviewAI;
