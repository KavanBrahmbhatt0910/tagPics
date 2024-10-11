import React, { useState } from 'react';
import '../App.css'; // Custom CSS for styling
import axios from 'axios';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const base_url = process.env.REACT_APP_API_ENDPOINT;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const resetForm = () => {
    setImage(null);
    setTags('');
    setPreviewUrl(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRemoveImage = () => {
    resetForm();
  };

  const handleUpload = async () => {
    if (!image || !tags) {
      setMessage('Please select an image and provide tags.');
      return;
    }
  
    try {
      setUploading(true);
      setMessage('');
      
      const reader = new FileReader();
      reader.readAsDataURL(image);
      
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        
        const requestBody = {
          tags: tags.split(',').map(tag => tag.trim()),
          image_data: base64Image
        };
    
        const uploadResponse = await axios.post(
          `${base_url}upload-image`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
    
        if (uploadResponse.status === 200) {
          setMessage('Image uploaded successfully!');
          resetForm();
        }
      };
    } catch (error) {
      setMessage('Error uploading image: ' + error.message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="upload-container">
        <h2>Upload Image</h2>
        
        <div className="upload-form">
          <div className="file-input-container">
            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" className="image-preview" />
                <button className="remove-image" onClick={handleRemoveImage}>
                  ✖ Remove Image
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="file-input-label">
                <div className="file-input-placeholder">
                  <span className="upload-text">📷 Click to select image</span>
                  <span className="file-input-hint">or drag and drop</span>
                </div>
              </label>
            )}
            <input 
              id="file-upload"
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="file-input" 
            />
          </div>

          <div className="input-group">
            <input 
              type="text" 
              placeholder="Enter tags (comma-separated)" 
              value={tags} 
              onChange={handleTagsChange}
              className="tag-input"
            />
          </div>

          <button 
            onClick={handleUpload} 
            disabled={uploading || !image || !tags}
            className="upload-button"
          >
            {uploading ? (
              <span className="loading">Uploading...</span>
            ) : (
              'Upload Image'
            )}
          </button>

          {message && (
            <p 
              style={{
                border: '1px solid #ccc', 
                padding: '10px', 
                borderRadius: '5px',
                backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
                color: message.includes('successfully') ? '#155724' : '#721c24'
              }} 
              className={`message ${message.includes('successfully') ? 'success' : 'error'}`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
