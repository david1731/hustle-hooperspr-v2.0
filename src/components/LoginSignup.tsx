'use client';

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/LoginSignup.css';
import { Button } from 'react-bootstrap';
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
    <section className="bg-primary p-3 p-md-4 p-xl-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-5">
                      <h3>Log in</h3>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 overflow-hidden">
                  <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                            type="fullname"
                            className="form-control"
                            name="fullname"
                            id="fullname"
                            placeholder="fullname"
                            required
                          />
                        <label htmlFor="fullname" className="form-label">Nombre y Apellido</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="name@example.com"
                            required
                          />
                        <label htmlFor="email" className="form-label">Email</label>
                      </div>
                    </div>
                    
                    <div className="col-12">
                      <div className="d-grid">
                        <Button className="btn bsb-btn-2xl btn-primary" type="submit">Log in</Button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-12">
                    <p className="mt-5 mb-4">Or continue with</p>
                    <div className="d-flex gap-3 flex-column">
                      <Button onClick={() => signIn('google')} className="btn bsb-btn-xl btn-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                          <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                        </svg>
                        <span className="ms-2 fs-6 text-uppercase">Sign in With Google</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
