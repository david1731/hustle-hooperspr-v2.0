'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateTrainer } from '../lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UserIcon, 
  EnvelopeIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  console.log('SignInPage rendering...'); // Debug log

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted with:', { email, fullname }); // Debug log
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
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              margin: '0 auto 16px auto',
              background: 'linear-gradient(to right, rgba(6, 182, 212, 0.2), rgba(236, 72, 153, 0.2))',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AcademicCapIcon style={{ width: '32px', height: '32px', color: '#06b6d4' }} />
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
              Portal de Entrenador
            </h1>
            <p style={{ color: '#9ca3af' }}>Accede a tu panel de administración</p>
          </div>

          {/* Sign In Card */}
          <Card className="bg-gray-900/50 border-gray-800" style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)', border: '1px solid #374151' }}>
            <CardHeader style={{ textAlign: 'center' }}>
              <CardTitle style={{ color: 'white', fontSize: '20px' }}>Iniciar Sesión</CardTitle>
              <CardDescription style={{ color: '#9ca3af' }}>
                Ingresa tus credenciales para acceder
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Email Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                    Correo Electrónico
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <EnvelopeIcon style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                    </div>
                    <input 
                      type="email"
                      placeholder="trainer@example.com"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required
                      style={{
                        width: '100%',
                        paddingLeft: '40px',
                        paddingRight: '16px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        backgroundColor: 'rgba(31, 41, 55, 0.5)',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                {/* Full Name Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                    Nombre Completo
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <UserIcon style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                    </div>
                    <input 
                      type="text"
                      placeholder="Juan Pérez"
                      value={fullname} 
                      onChange={(e) => setFullname(e.target.value)} 
                      required
                      style={{
                        width: '100%',
                        paddingLeft: '40px',
                        paddingRight: '16px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        backgroundColor: 'rgba(31, 41, 55, 0.5)',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: 'rgba(127, 29, 29, 0.2)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <ExclamationTriangleIcon style={{ width: '20px', height: '20px', color: '#f87171', flexShrink: 0 }} />
                    <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }}>{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    height: '48px',
                    background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '16px'
                  }}
                >
                  <span>Iniciar Sesión</span>
                  <ArrowRightIcon style={{ width: '20px', height: '20px' }} />
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              ¿Problemas para acceder? Contacta al administrador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
