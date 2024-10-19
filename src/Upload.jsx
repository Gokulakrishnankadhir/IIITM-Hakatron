import React, { useState } from 'react';
import axios from 'axios';
import './upload.css';
import { Link } from 'react-router-dom'; // Your CSS file for styling
import UploadCertificates from './mint';

const DocumentUpload = ({ loggedInUser }) => {
  const [metaMaskID, setMetaMaskID] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ipfsLink, setIpfsLink] = useState(''); // State to store IPFS link

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the uploaded file
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!file) {
      setMessage('Please select a PDF file to upload.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: 'Infinity', // Allow large files
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: 'e178dee469165b9be706', // Replace with your Pinata API Key
            pinata_secret_api_key:
              'f97187a37625d9da285556688ed0f6b30961f761150ca8becb63541fc5372e75', // Replace with your Pinata Secret Key
          },
        }
      );

      const ipfsHash = response.data.IpfsHash; // Get the IPFS hash
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`; // Generate the IPFS URL
      setIpfsLink(ipfsUrl); // Set the IPFS link in state
      setMessage('Document uploaded successfully!'); // Success message
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('An error occurred during upload.'); // Error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="txt">Document Upload</h2>
      <p>Logged in as: {loggedInUser}</p> {/* Display logged-in user information */}

      <form onSubmit={handleUpload}>
        <div className="input-group">
          <label htmlFor="metaMaskID">MetaMask ID:</label>
          <input
            id="metaMaskID"
            type="text"
            value={metaMaskID}
            placeholder="Enter MetaMask ID"
            onChange={(e) => setMetaMaskID(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="studentName">Student Name:</label>
          <input
            id="studentName"
            type="text"
            value={studentName}
            placeholder="Enter Student Name"
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="studentID">Student ID:</label>
          <input
            id="studentID"
            type="text"
            value={studentID}
            placeholder="Enter Student ID"
            onChange={(e) => setStudentID(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="file">Upload PDF:</label>
          <input
            id="file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        
        </div>

        <button type="submit" className="upload-button" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>

        {/* Message area */}
        {message && (
          <p className={`message ${message.includes('error') ? 'error-message' : 'success-message'}`}>
            {message}
          </p>
        )}
        

        {/* Display IPFS link after successful upload */}
       
      </form>
      {ipfsLink && (
          <p className="ipfs-link">
            IPFS Link:{' '}
            <a href={ipfsLink} target="_blank" rel="noopener noreferrer">
              {ipfsLink}
            </a>
          </p>
        )}
        <h3>or</h3>
      <Link to="/mint"><button className='group'>Group</button></Link>
    </div>
  );
};

export default DocumentUpload;
