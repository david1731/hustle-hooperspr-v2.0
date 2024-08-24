'use client';
import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap'; // Add this line
import LoginSignup from './LoginSignup'; // Import your LoginSignup component

export default function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [flyer, setFlyer] = useState(false);
  const [flyerTwo, setFlyerTwo] = useState(false);
  const [showModal, setShowModal] = useState(false); // Add this line

  const handleShow = () => setShowModal(true); // Add this line
  const handleClose = () => setShowModal(false); // Add this line

  return (
    <header className="fixed top-0 w-full clearNav z-50">
      <div className="max-w-5xl mx-auto flex flex-wrap p-5 flex-col md:flex-row">
        <div className="flex flex-row items-center justify-between p-3 md:p-1">
          <a href="/" className="flex text-3xl text-white font-medium mb-4 md:mb-0">
            HustleHoopersPR
          </a>
          <button
            className="text-white pb-4 cursor-pointer leading-none px-3 py-1 md:hidden outline-none focus:outline-none content-end ml-auto"
            type="button"
            aria-label="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        <div
          className={
            "md:flex flex-grow items-center" +
            (navbarOpen ? " flex" : " hidden")
          }
        >
          <div className="md:ml-auto md:mr-auto font-4 pt-1 md:pl-14 pl-1 flex flex-wrap items-center md:text-base text-1xl md:justify-center justify-items-start">
            <a
              className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04"
              onClick={handleShow} // Change this line
            >
              Sacar Cita
            </a>
            <a href="#servicios" className="mr-12 md:ml-11 ml-0 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
              Nuestros Servicios
            </a>
            <a href="#niveles" className="mr-12 md:ml-11 ml-0 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
              Niveles
            </a>
            <a href="#mision" className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
              Nuestra Misión
            </a>
          </div>
          <a
            href="https://www.instagram.com/hustlehooperspr/"
            rel="noopener noreferrer"
            target="_blank"
            className="pl-7 md:visible"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-instagram"
                width="30"
                height="30"
            >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered> {/* Add this modal block */}
        <Modal.Header closeButton>
          <Modal.Title>Log in / Registrar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginSignup />
        </Modal.Body>
      </Modal>
    </header>
  );
}
