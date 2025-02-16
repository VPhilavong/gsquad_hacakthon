import React, { useState } from 'react';
import './Interview.css';

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleButtonClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    console.log('Recording started');
    // Add your recording logic here
  };

  const stopRecording = () => {
    console.log('Recording stopped');
    // Add your stop recording logic here
  };

  return (
    <div className="container">
      <button className="button" onClick={handleButtonClick}>
        <div className="button2">{isRecording ? 'Stop' : 'Start'}</div>
      </button>
      
    </div>
  );
};

export default Interview;
