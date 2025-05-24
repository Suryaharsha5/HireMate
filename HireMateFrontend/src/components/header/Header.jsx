import React, { useContext } from 'react';
import Logo from '../gallery/Logo.png';
import { Link } from 'react-router-dom';
import './Header.css';
import { FaHandsHelping } from "react-icons/fa";
import { usercontext } from '../../context/userLoginContext';

function Header() {
  const { logout, loginStatus, curruser } = useContext(usercontext);

  return (
    <header className="px-3 text-white pt-3" style={{ position: 'fixed', width: '100%', backgroundColor: '#012a36' }}>
      <div className="container-fluid">
        <div className="row align-items-center">
        
          <div className="col-md-3">
            <img src={Logo} alt="Logo" className="w-75" />
          </div>

          <div className="col-md-6 text-center">
            <nav className="d-flex justify-content-center gap-5">
              <Link to="/" className="fs-4 text-decoration-none text-white">Home</Link>
              <Link to="/about" className="fs-4 text-decoration-none text-white">About</Link>
              <Link to="/contact" className="fs-4 text-decoration-none text-white">Contact Us</Link>
            </nav>
          </div>

         
          <div className="col-md-3 d-flex justify-content-end align-items-center gap-3">
            {loginStatus ? (
              <div className="dropdown">
                <button
                  className="btn btn-info dropdown-toggle"
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {curruser.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      LogOut
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              null
            )}
            <FaHandsHelping className="fs-1 text-white" />
          </div>
        </div>
      </div>
      <hr />
    </header>
  );
}

export default Header;
