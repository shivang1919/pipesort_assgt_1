import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

function Frontpage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const handleInputChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/upload',
        { videoUrl },
        {
          retries: 5, // Set the maximum number of retries here
        }
      );
      alert(response.data.message);
      setDownloadLink(`http://localhost:8000/download/${response.data.videoId}`);
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading the video.');
    }
    setUploading(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-gray-900"
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-md">
        <h1 className="text-4xl font-bold mb-4 text-center">Noise Removal App</h1>
        <form onSubmit={handleFormSubmit} className="mb-4">
          <input
            type="text"
            value={videoUrl}
            onChange={handleInputChange}
            placeholder="Enter video URL"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            disabled={uploading || !videoUrl}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {downloadLink && (
          <div className="text-center">
            <p className="mb-2">Download Link:</p>
            <a href={downloadLink} download className="text-blue-500">
              Download Processed Video
            </a>
          </div>
        )}
        <p className="mt-4 text-center text-xs text-gray-500">
          By using this service, you agree to our{' '}
          <a href="/terms" className="text-blue-500 underline">
            Terms and Conditions
          </a>
          . All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Frontpage;