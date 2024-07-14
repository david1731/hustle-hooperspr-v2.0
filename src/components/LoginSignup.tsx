'use client'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/LoginSignup.css';
import { Button } from 'react-bootstrap'; // Import Button from react-bootstrap
import GoogleButton from 'react-google-button';

export default function LoginSignup() {
  return (
    <div className="container">
      <div className="row align-items-center min-vh-100">
        <div className="col-md-6 col-sm-12 login-section p-5">
          <h2>Sign In</h2>
          <GoogleButton >Sign in with Google</GoogleButton> {/* Use Button component */}
        </div>
        <div className="col-md-6 col-sm-12 signup-section p-5">
          <h2>Welcome to Login</h2>
          <p>Do not have an account?</p>
          <form>
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" placeholder="Enter your name" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="lastname">Last Name</label>
              <input type="text" className="form-control" id="lastname" placeholder="Enter your last name" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="phone">Cellphone</label>
              <input type="text" className="form-control" id="phone" placeholder="Enter your cellphone number" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" placeholder="Enter your email" />
            </div>
            <Button type="submit" variant="primary" className="mt-3">Sign Up</Button> {/* Use Button component */}
          </form>
        </div>
      </div>
    </div>
  );
}

