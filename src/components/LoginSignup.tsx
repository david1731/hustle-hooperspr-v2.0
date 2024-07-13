import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/LoginSignup.css'; 

export default function LoginSignup (){
  return (
    <div className="container">
      <div className="row align-items-center min-vh-100">
        <div className="col-md-6 col-sm-12 login-section p-5">
          <h2>Sign In</h2>
          <button className="btn btn-primary btn-google mt-3">Sign in with Google</button>
        </div>
        <div className="col-md-6 col-sm-12 signup-section p-5">
          <h2>Welcome to Login</h2>
          <p>Don't have an account?</p>
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
            <button type="submit" className="btn btn-primary mt-3">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};


