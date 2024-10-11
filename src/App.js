import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import ImageUploader from './Components/ImageUploader';
import ImageGallery from './Components/ImageGallery';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<ImageUploader />} />
        <Route path="/gallery" element={<ImageGallery />} />
      </Routes>
    </Router>
  );
};

export default App;
