'use client';
import React, { useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';

export default function TrainerDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const { trainer_id } = params;

  useEffect(() => {
    if (!trainer_id) {
      router.push('/trainerSignin'); // Redirect to sign-in if trainer_id is missing
    }
  }, [trainer_id, router]);

  if (!trainer_id) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, Trainer {trainer_id}</h1>
      {/* Render dashboard content here */}
    </div>
  );
}


