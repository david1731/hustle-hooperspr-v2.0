'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateTrainer } from '../lib/data';

export default function SignInPage(){
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const trainer = await validateTrainer(email, fullname);
      if (trainer) {
        
        router.push(`/trainerDashboard`);
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Error validating your information. Please try again.');
      alert(`Fullname:" ${fullname}`)
      alert(`Email:" ${email}`)
    }
   
  };

  return (
    <div>
      <h1>Trainer Sign In</h1>
      <form onSubmit={handleSignIn}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input 
            type="text" 
            value={fullname} 
            onChange={(e) => setFullname(e.target.value)} 
            required 
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};
