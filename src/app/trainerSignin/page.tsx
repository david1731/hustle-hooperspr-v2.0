'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateTrainer } from '../lib/data';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const trainer = await validateTrainer(email, fullname);
      if (trainer) {
        router.push(`/trainerSignin/${trainer.trainer_id}/trainerDashboard`);
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Error validating your information. Please try again.');
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Trainer Sign In</h1>
              <form onSubmit={handleSignIn}>
                <div className="mb-3">
                  <label>Email:</label>
                  <input 
                    type="email" 
                    className="form-control"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label>Full Name:</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={fullname} 
                    onChange={(e) => setFullname(e.target.value)} 
                    required 
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary w-100">Sign In</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
