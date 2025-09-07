
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from './axiosConfig';
import './Header.css';
import logo from './logo.png'
import { useNavigate } from "react-router-dom";

function Header() {
  const { token, logout, name } = useAuth();
  // console.log('token is : ',token)
  const navigate=useNavigate();
  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      logout();
      alert("Logged out!");
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // console.log("parsed useris : ",parsedUser)
          // console.log("stored useris : ",storedUser)
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }, []);

  return (
    <nav id='navbar' className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"><img src={logo} alt='logo' height={'50px'} width={'50px'}></img></Link>
        <button className="navbar-toggler bg-light" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon bg-light"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 gap-2 mb-lg-0 d-flex align-items-center">
            <li className="nav-item d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
</svg>
              <Link className="nav-link" to="/">
              
              Home</Link>
            </li>

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                  <li className="nav-item">
                  <Link className="nav-link" 
                  to="#"
  onClick={(e) => {
    e.preventDefault();
    if (token === null || token==='') {
      handleLogout();
    } else {
      navigate("/dashboard");
    }
  }}
                  >Dashboard</Link>
                </li>
              <li className="nav-item d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg>
                <Link className="nav-link" to={'/cart'}>Cart</Link>
              </li>
                <li className="nav-item nav-link" style={{ cursor: 'pointer', }} onClick={handleLogout}>
                  Logout
                </li>
              </>
            )}
          </ul>

          {token && (
            <span className="navbar-text text-light">Welcome, {name || "User"}</span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
