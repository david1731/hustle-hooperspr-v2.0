// src/components/NavBar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import LoginSignup from './LoginSignup';

export default function NavBar() {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link href="/" className="navbar-brand">HustleHoopers</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Button onClick={handleShow} className="nav-link active" aria-current="page">
                  Login/Registrar
                </Button>
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
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log in / Registrar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginSignup />
        </Modal.Body>
      </Modal>
    </>
  );
}


 


