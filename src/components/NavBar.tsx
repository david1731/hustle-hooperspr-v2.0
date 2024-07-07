// src/components/NavBar.tsx
import React from 'react';
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">HustleHoopers</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/registrar_login" className="nav-link active" aria-current="page">
                Login/Registrar
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#servicios" className="nav-link">
                Servicios
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#info" className="nav-link">
                Información
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;


