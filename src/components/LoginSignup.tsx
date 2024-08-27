// src/components/LoginSignup.tsx
'use client';

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/LoginSignup.css';
import { Button } from 'react-bootstrap';
import { signIn } from 'next-auth/react';

export default function LoginSignup() {
  return (
    <div className="container">
      <div className="text-center mb-4">
        <h2>Join HustleHoopers</h2>
      </div>
      <div className="my-3">Tienes cuenta?</div>
      <div className="d-grid gap-3">
        {/* uses google auth and redirects to personalized dashboard */}
        <Button onClick={() => signIn('google', {callbackUrl: '/dashboard'})} className="btn bsb-btn-xl btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
          </svg>
          <span className="ms-2 fs-6 text-uppercase">Accede con Google</span>
        </Button>
      </div>
      <div className="text-center my-3">
        <hr className="grey-line" />
      </div>
      <div className="my-3">No tienes cuenta?</div>

      <div className="d-grid gap-3">
        <Button onClick={() => signIn('google', {callbackUrl: '/dashboard'})} className="btn bsb-btn-xl btn-danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
          </svg>
          <span className="ms-2 fs-6 text-uppercase">Registrese con Google</span>
        </Button>
      </div>
    </div>
  );
}
