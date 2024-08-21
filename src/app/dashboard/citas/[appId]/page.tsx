'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchInfoFromAppID, fetchAvailableDates, fetchSlots, editAppointment } from '@/app/lib/data';
import { Level, Service, TrainerSlots } from '@/app/lib/definitions';

export default function AppDetails() {
  const router = useRouter();
  const { appId } = useParams();
  const [appDetails, setAppDetails] = useState<any>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<TrainerSlots[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAppDetails = async () => { //function for getting the appointment info of the desired appointment(using the app_id)to edit the appointment info
    try {
      if (!appId) return; //error handling

      const parsedAppId = parseInt(Array.isArray(appId) ? appId[0] : appId, 10); //checks if appId is an array, if it is an array appId is set to the first element of the array
      // if it is not an array, it is set to its numeric value

      if (isNaN(parsedAppId)) { //if app id is not a number, throw an error
        throw new Error('Invalid appId');
      }

      const result = await fetchInfoFromAppID(parsedAppId); //fetch the appointment info using the appId
      setAppDetails(result); // store the app info using state
    } catch (error) { //error handling
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => { //execute the function that fetches the app info
    getAppDetails(); // this useEffect runs when the component mounts and everytime the appId changes
  }, [appId]);

  useEffect(() => { //fetching levels and services using api routes I defined
    async function fetchLevels() {
      try {
        const response = await fetch(`/api/levels`); //api route for levels
        if (!response.ok) {
          throw new Error('Failed to fetch levels');
        }
        const data = await response.json();
        setLevels(data); //store the info from the function as state for later use
      } catch (error) { //error handling
        if (error instanceof Error) {
          console.error('Error fetching levels:', error);
          setError(error.message);
        }
      }
    }

    async function fetchServices() {
      try {
        const response = await fetch(`/api/services`); //api route for services
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data); //store the info from the function as state for later use
      } catch (error) { //error handling
        if (error instanceof Error) {
          console.error('Error fetching services:', error);
          setError(error.message);
        }
      }
    }

    fetchLevels();
    fetchServices();
  }, []); //the useEffect is execute only when the component mounts

  //function that handles the levels dropdown, when the user selects a level, its levelId is store for later use when creating the appointment
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = Number(e.target.value);
    setSelectedLevel(levelId);
    console.log('Selected level_id:', levelId);
  };

  //function that handles the services dropdown, when the user selects a service, its serviceId is store for later use when creating the appointment
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = Number(e.target.value);
    setSelectedService(serviceId);
    console.log('Selected service_id:', serviceId);
  };

  //function that handles the date dropdown, when the user selects a date, its value is store for later use when creating the appointment
  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
    console.log('Selected date:', e.target.value);
  };

  //function that handles the slots dropdown, when the user selects a slot, its slotId is store for later use when creating the appointment
  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotId = Number(e.target.value);
    setSelectedSlot(slotId);
    console.log('Selected slot_id:', slotId);
  };

  //displays the slots, depending on the date
  const handleSlotDropdownClick = async () => {
    try {
      if (!selectedDate || !appDetails?.trainer_id) return;
      const parsedTrainerId = Array.isArray(appDetails.trainer_id) ? appDetails.trainer_id[0] : appDetails.trainer_id;
      const slotsData = await fetchSlots(parseInt(parsedTrainerId), selectedDate); // function that fetches the slots for a given date
      setSlots(slotsData); //storing the slots info as state
    } catch (error) { //error handling
      if (error instanceof Error) {
        console.error('Error fetching available time slots:', error);
        setError(error.message);
      }
    }
  };

  //displays the dates given a trainerId becuase every trainer may have distinct schedules
  const handleDateDropdown = async () => {
    try {
      if (!appDetails?.trainer_id) return; //if trainerId does not exist, something is wrong so return out
      const parsedTrainerId = Array.isArray(appDetails.trainer_id) ? appDetails.trainer_id[0] : appDetails.trainer_id; //checking trainerId to set its value accordingly and avoid errors
      const datesData = await fetchAvailableDates(parseInt(parsedTrainerId)); //fetch the trainer's available dates
      setDates(datesData || []); // store dates as state or as an empty array if the function returns nothing
    } catch (error) { //error handling
      if (error instanceof Error) {
        console.error('Error fetching available dates:', error);
        setError(error.message);
      }
    }
  };

  //function that edits an appointment with the new information a user enters
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (appDetails) {
      try {
        const parsedAppId = parseInt(Array.isArray(appId) ? appId[0] : appId, 10); //checking appId to set its value accordingly and avoid errors
        const result = await editAppointment(
          parsedAppId,
          appDetails.slot_id,
          selectedSlot ?? 0,
          appDetails.trainer_id,
          appDetails.service_id,
          selectedService ?? 0,
          appDetails.level_id,
          selectedLevel ?? 0,
          selectedDate,
          appDetails.appointment_date
        ); //edit appointment
        console.log('Appointment edited:', result);
        alert('Appointment edited successfully');
        router.push(`/dashboard/citas`); //if the edit is successfull redirect back to appointments page
        
      } catch (error) {
        console.error('Error editing appointment:', error);
        alert('Failed to edit appointment');
      }
    } else {
      alert('Please select all fields');
    }
  };

  return (
    <>
      {/* Edit Form */}
      {appDetails && (
        <div className="container mt-4">
          <h1 className="mb-4">Edit Appointment</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleEdit}>
            <div className="mb-3">
              <label htmlFor="dates" className="form-label">Select a Date</label>
              <select
                id="dates"
                className="form-select"
                onChange={handleDateChange}
                onClick={handleDateDropdown}
                value={selectedDate}
              >
                <option value="" disabled>{appDetails.appointment_date}</option>
                {dates.map((date) => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="slots" className="form-label">Select a Slot</label>
              <select
                id="slots"
                className="form-select"
                onChange={handleSlotChange}
                onClick={handleSlotDropdownClick}
                value={selectedSlot ?? ''}
              >
                <option value="" disabled>{appDetails.start_time} - {appDetails.end_time}</option>
                {slots.map((slot) => (
                  <option key={slot.slot_id} value={slot.slot_id}>
                    {slot.starttime} - {slot.endtime} on {slot.date}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="levels" className="form-label">Select a Level</label>
              <select
                id="levels"
                className="form-select"
                onChange={handleLevelChange}
                value={selectedLevel ?? ''}
              >
                <option value="" disabled>{appDetails.level}</option>
                {levels.map((level) => (
                  <option key={level.level_id} value={level.level_id}>
                    {level.level}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="services" className="form-label">Select a Service</label>
              <select
                id="services"
                className="form-select"
                onChange={handleServiceChange}
                value={selectedService ?? ''}
              >
                <option value="" disabled>{appDetails.service}</option>
                {services.map((service) => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.servicename}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Editar Cita</button>
          </form>
        </div>
      )}
    </>
  );
}




