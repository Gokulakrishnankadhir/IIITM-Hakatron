import React, { useState } from 'react';
import axios from 'axios';
import './mint.css';

function UploadCertificates() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      setMessage('');

      // Send the file to the backend
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data);
    } catch (error) {
      console.error("Error uploading the file", error);
      setMessage("There was an error processing the certificates.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Certificate Data (Excel)</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".xlsx" />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload and Process'}
        </button>
      </form>
      {message && <p className="upload-message">{message}</p>}
    </div>
  );
}

export default UploadCertificates;
