'use client';

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/LoginSignup.css';
import { Button } from 'react-bootstrap';
import GoogleButton from 'react-google-button';
import { signIn } from 'next-auth/react';

export default function LoginSignup() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Convert FormData to a plain object
    const formObj: Record<string, any> = {};
    formData.forEach((value, key) => {
      formObj[key] = value;
    });

    const response = await fetch('/api/create-client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formObj), // Ensure the body is sent as JSON
    });

    const result = await response.json();
    if (result.message) {
      alert(result.message);
    } else {
      // Handle successful signup, redirect or show success message
    }
  };

  return (
    <div className="container">
      <div className="row align-items-center min-vh-100">
        <div className="col-md-6 col-sm-12 login-section p-5">
          <h2>Sign In</h2>
          <GoogleButton onClick={() => signIn('google')} className="mx-auto" />
        </div>
        <div className="col-md-6 col-sm-12 signup-section p-5">
          <h2>Welcome to Login</h2>
          <p>Do not have an account?</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" name="name" placeholder="Enter your name" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="lastname">Last Name</label>
              <input type="text" className="form-control" id="lastname" name="lastname" placeholder="Enter your last name" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="phone">Cellphone</label>
              <input type="text" className="form-control" id="phone" name="phone" placeholder="Enter your cellphone number" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" />
            </div>
            <Button type="submit" variant="primary" className="mt-3">Sign Up</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
