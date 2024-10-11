import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [tag, setTag] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(6); 
  const [loading, setLoading] = useState(false); 

  const base_url = process.env.REACT_APP_API_ENDPOINT;

  const handleTagSearch = async () => {
    setLoading(true); // Set loading to true
    try {
      if(!tag) {
        fetchAllImages();
        return; 
      }
      const response = await axios.post(`${base_url}get-by-resource`, { tag });
  
      if (response.status === 200) {
        setImages(JSON.parse(response.data.body));
      }
    } catch (error) {
      setMessage('Error retrieving images.');
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchAllImages = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await axios.get(`${base_url}get-image`);
  
      if (response.status === 200) {
        const parsedImages = JSON.parse(response.data.body);  // Parse the string response into JSON
        setImages(parsedImages); // Now you can set the parsed images
      }
    } catch (error) {
      setMessage('Error retrieving images.');
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleDelete = async (imageID) => {
    try {
      const deleteResponse = await axios.post(`${base_url}delete-image`, { imageID });

      if (deleteResponse.status === 200) {
        setMessage('Image deleted successfully!');
        setImages(images.filter(image => image.imageID !== imageID));
      }
    } catch (error) {
      setMessage('Error deleting image.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllImages();
  }, []);

  // Pagination Logic
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;  
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const nextPage = () => {
    if (currentPage < Math.ceil(images.length / imagesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="gallery-container">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search by tag" 
          value={tag} 
          onChange={(e) => setTag(e.target.value)} 
          className="search-input" 
        />
        <button onClick={handleTagSearch} className="search-button">Search</button>
      </div>
      {message && <p className="message">{message}</p>}
      
      {/* Loading Indicator */}
      {loading ? (
        <div className="loading-indicator">
          <p>Loading images...</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {currentImages.map((image) => (
            <div className="gallery-item" key={image.imageID}>
              <img src={image.imageUrl} alt="gallery" className="gallery-image" />
              <p className="tags">{image.tags.join(', ')}</p>
              <button className="delete-button" onClick={() => handleDelete(image.imageID)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Buttons */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">Previous</button>
        <span className="page-info">Page {currentPage} of {Math.ceil(images.length / imagesPerPage)}</span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(images.length / imagesPerPage)} className="pagination-button">Next</button>
      </div>
    </div>
  );
};

export default ImageGallery;
