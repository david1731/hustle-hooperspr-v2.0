'use client';
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TrainerDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trainerId, setTrainerId] = useState<string | null>(null);

  useEffect(() => {
    const queryTrainerId = searchParams.get('trainer_id');

    if (queryTrainerId) {
      setTrainerId(queryTrainerId);
    } else {
      console.warn('No trainer_id found');
      router.push('/trainerSignin'); // Redirect to sign-in if no trainer_id is found
    }
  }, [searchParams, router]);

  if (!trainerId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, Trainer {trainerId}</h1>
      {/* Render dashboard content here */}
    </div>
  );
}


