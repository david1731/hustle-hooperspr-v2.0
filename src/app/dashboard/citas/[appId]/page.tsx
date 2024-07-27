'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchInfoFromAppID } from '@/app/lib/data'; // Ensure you import the correct function

const AppDetails = () => {
  const { appId } = useParams();
  const [appDetails, setAppDetails] = useState<any>(null); // Adjust the type as needed
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAppDetails = async () => {
      try {
        if (!appId) return;

        const parsedAppId = parseInt(Array.isArray(appId) ? appId[0] : appId, 10);
        if (isNaN(parsedAppId)) {
          throw new Error('Invalid appId');
        }

        const result = await fetchInfoFromAppID(parsedAppId);
        setAppDetails(result);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
        }
    };
    

    getAppDetails();
  }, [appId]);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {appDetails ? (
        <div>
          <h2>Appointment Details</h2>
          <p>Trainer: {appDetails.fullname} (ID: {appDetails.trainer_id})</p>
          <p>Slot: {appDetails.start_time} - {appDetails.end_time} (ID: {appDetails.slot_id})</p>
          <p>Level: {appDetails.level} (ID: {appDetails.level_id})</p>
          <p>Service: {appDetails.service} (ID: {appDetails.service_id})</p>
          <p>Date: {appDetails.appointment_date}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AppDetails;
