import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/LogoText.svg'; // Import the logo image

const Navbar = () => {
  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="MindMeld Logo" className="h-10 mr-2" /> 
        </Link>
        <div>
          <Link to="/login" className="text-white mr-4">
            Login
          </Link>
          <Link to="/register" className="text-white mr-4">
            Register
          </Link>
          <Link to="/dashboard" className="text-white">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
