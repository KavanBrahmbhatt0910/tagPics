import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <h1 className="app-title">Image Gallery App</h1>
        <nav className="nav-bar">
          <Link to="/upload" className="nav-link">Upload Image</Link>
          <Link to="/gallery" className="nav-link">Search Image</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
