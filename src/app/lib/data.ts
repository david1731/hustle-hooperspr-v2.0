import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { AppointmentQueryResult, Trainer, TrainerSlots, updateTimeSlot, InfoFromAppointments, TimeSlot} from './definitions';
import { clients, appointment_slots, trainers, services, time_slots, levels,trainer_time_slots } from '../../../drizzle/schema';

import { config } from 'dotenv';
config();
const db = drizzle(sql, {
  schema: {
    clients: clients,
    trainers: trainers,
    services: services,
    time_slots: time_slots,
    levels: levels,
    trainer_time_slots: trainer_time_slots,
    appointment_slots: appointment_slots,
  }
});

export async function getUserAppointmentsByEmail(email: string){ //fetches the user's appointments given their email, fetched from their session when signed in with google
  try {
    //type defined to store the query results
    const data = await sql<AppointmentQueryResult>` 
      SELECT 
        a.app_id,
        c.fullname AS client_name,
        t.fullname AS trainer_fullname,
        ts.start_time AS starttime,
        ts.endtime AS endtime,
        l.level AS level,
        s.servicename AS service,
        a.date AS appointment_date,
        a.paidstatus as status
      FROM 
        appointment_slots a
      JOIN 
        clients c ON a.client_id = c.id
      JOIN 
        trainers t ON a.trainer_id = t.trainer_id
      JOIN 
        time_slots ts ON a.slot_id = ts.slot_id
      JOIN 
        levels l ON a.level_id = l.level_id
      JOIN 
        services s ON a.service_id = s.service_id
      WHERE 
        c.email = ${email};
    `;
    
    //console.log('Query Result:', data);  Log the query result
    //mapping the results to their row value and handles null values
    const appointments = data.rows.map((row) => ({
        app_id: row.app_id ?? 0,
        client_name: row.client_name ?? 'Unknown',
        trainer_fullname: row.trainer_fullname ?? 'Unknown',
        starttime: row.starttime ?? 'Unknown',
        endtime: row.endtime ?? 'Unknown',
        level: row.level ?? 'Unknown',
        service: row.service ?? 'Unknown',
        appointment_date: row.appointment_date ?? 'Unknown',
        status: row.status ?? 'Unknown'
      
    }));
    return appointments;
  } catch (error) { //error handling
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user appointments.');
  }
}

//create appointment should receive appointmentId(app_id), slot_id, client_id(id), 
//level_id, trainer_id, service_id, date
export async function createAppointment(
  slot_id: number,
  email: string,
  level_id: number,
  trainer_id: number, 
  service_id: number, 
  app_date: string,
  paidstatus: string){
    try {
      //create an appointment using the clients email from the session
      const result = await sql`
      WITH client AS (
        SELECT id FROM clients WHERE email = ${email}
      )
      INSERT INTO appointment_slots (slot_id, client_id, level_id, trainer_id, service_id, date, paidstatus)
      SELECT ${slot_id}, id, ${level_id}, ${trainer_id}, ${service_id}, ${app_date}, ${paidstatus}
      FROM client
      RETURNING *;
    `;
  
      //console.log('Insert Result:', result);
      return result;
    } catch (error) { //error handling
      console.error('Error inserting appointment:', error);
      throw new Error('Failed to create appointment.');
    }
  }
    

export async function fetchTrainers(){ //fetches all trainers in database
  try{
    const data = await sql<Trainer>`
    SELECT trainer_id, fullname, email FROM trainers;
    `;

  const result = data.rows.map((row) => ({ //maps the values with row names for easier use
    trainer_id: row.trainer_id ?? 0,
    fullname: row.fullname ?? 'Unknown',
    email: row.email ?? 'Unknown',
    }));
    
    return result;
  } catch (error) { //error handling
    if (error instanceof Error) {
      console.error('Detailed error information:', {
        message: error.message,
        stack: error.stack,
        sql: process.env.DATABASE_URL,
      });
      throw new Error(`Failed to fetch trainers from data.ts: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
      throw new Error('Failed to fetch trainers from data.ts: An unknown error occurred');
    }
  }
}



export async function updateTimeSlotStatus(
  slot_id: number,
  trainer_id: number,
  date: string,
  new_status: string
){
  try { //given a slot id, trainer-id, date and a new status,update available time slot as unavailable
    const result = await sql<updateTimeSlot>`
      UPDATE trainer_time_slots
      SET status = ${new_status}
      WHERE slot_id = ${slot_id}
        AND trainer_id = ${trainer_id}
        AND date = ${date};
    `;

    // console.log('Update Result:', result);
  } catch (error) { //error handling
    console.error('Error updating time slot status:', error);
    throw new Error('Failed to update time slot status.');
  }
}


export async function fetchSlots(trainerId: number, date: string){
  try {
    // console.log(`Fetching slots for trainerId: ${trainerId}, date: ${date}, status: 'Available'`);
    //fetch a trainer's time slots on a given date
    //selects distinct time slots in case a trainer inserts the same slot id two times on the same date
    //only selects available dates to avoid clients from making an appointment on a prohibited date
    const result = await sql<TrainerSlots>`
    SELECT DISTINCT ON (tts.slot_id) 
      tts.slot_id, 
      ts.start_time AS starttime, 
      ts.endtime, 
      tts.date,
      tts.status
    FROM 
      trainer_time_slots tts
    JOIN 
      time_slots ts ON tts.slot_id = ts.slot_id
    WHERE 
      tts.trainer_id = ${trainerId} AND tts.date = ${date} AND tts.status = 'Available'
    ORDER BY 
      tts.slot_id ASC, 
      ts.start_time ASC;
    `;
    //console.log('fetchSlotByTrainerID result:', result);

    if (result.rows.length === 0) {
      throw new Error('No slots found');
    }

    return result.rows.map((row) => ({ //mapping results
      slot_id: row.slot_id ?? 0,
      starttime: row.starttime ?? 'Unknown',
      endtime: row.endtime ?? 'Unknown',
      date: row.date ?? 'Unknown',
      status: row.status ?? 'Unknown',
    }));
  } catch (error) { //error handling
    console.error('SQL query error:', error);
    throw new Error('Failed to execute SQL query');
  }
};

export async function fetchAvailableDates(trainerId:number){
  try { //fetches the days a trainer has available hours
    const result = await sql`SELECT DISTINCT date FROM trainer_time_slots WHERE trainer_id = ${trainerId} AND status = 'Available'`;
    return result.rows.map((row) => row.date);
  } catch (error) {//error handling
    console.error('Error fetching available dates:', error);
    return [];
  }
}

export async function fetchDeleteUpdateApp(app_id: number){
  try{
    //selects an appointments info for deletion
    const info = await sql<InfoFromAppointments>` 
      SELECT trainer_id, slot_id, date 
      FROM appointment_slots 
      WHERE app_id = ${app_id};
    `
    if(info.rows.length === 0){
      throw new Error('No information found for the given appointment ID.');
    }
    const { trainer_id, slot_id, date} = info.rows[0]; //saved info from query

    //delete the appointment
    const cancel = await sql`
      DELETE from appointment_slots WHERE app_id = ${app_id};     
    `;

    //update the status of the canceled timeslot back to Available
    const updateResult = await sql`
      UPDATE trainer_time_slots SET status = 'Available'
      WHERE trainer_id = ${trainer_id} 
      AND slot_id = ${slot_id}
      AND date = ${date};
    `
  } catch(error){ //error handling
    console.error("Error updating info")
  }
}

export async function fetchInfoFromAppID(app_id: number){ //fetches an appointment's additional info, given its primary key
  try{
    const result = await sql`
    SELECT 
    t.trainer_id,
    t.fullname,
    ts.slot_id,
    ts.start_time AS start_time,
    ts.endtime AS end_time,
    l.level_id,
    l.level,
    s.service_id,
    s.servicename AS service,
    a.date AS appointment_date
  FROM 
    appointment_slots a
  JOIN 
    trainers t ON a.trainer_id = t.trainer_id
  JOIN 
    time_slots ts ON a.slot_id = ts.slot_id
  JOIN 
    levels l ON a.level_id = l.level_id
  JOIN 
    services s ON a.service_id = s.service_id
  WHERE 
    a.app_id = ${app_id};
    `;
    return result.rows[0];
  }catch(error){ //error handling
    throw new Error("Errof fetching information");
  }
}

export async function editAppointment(
  app_id: number,
  old_slot_id: number,
  new_slot_id: number,
  trainer_id: number,
  old_service_id: number,
  new_service_id: number,
  old_level_id: number,
  new_level_id: number,
  new_date: string,
  old_date:string
) {
  try {
    console.log("edit appointment");
    
    // If the user doesnt make any changes but the clicks on the edit button, run the function with the original values
    if(!new_date){
      new_date = old_date;
    }
    if(!new_slot_id){
      new_slot_id = old_slot_id;
    }
    if(!new_level_id){
      new_level_id = old_level_id;
    }
    if(!new_service_id){
      new_service_id = old_service_id;
    }

    // Update the appointment with new credentials
    const result = await sql`
      UPDATE appointment_slots
      SET
        slot_id = ${new_slot_id},
        service_id = ${new_service_id},
        level_id = ${new_level_id},
        date = ${new_date}
      WHERE app_id = ${app_id}
    `;

    console.log("Appointment updated:", result);

    // If a new slot is selected, edit the new slot's status to Unavailable and the old slot's status to Available
    if (old_slot_id !== new_slot_id) {
      await sql`
        UPDATE trainer_time_slots
        SET status = 'Available'
        WHERE slot_id = ${old_slot_id} AND trainer_id = ${trainer_id}
      `;

      await sql`
        UPDATE trainer_time_slots
        SET status = 'Unavailable'
        WHERE slot_id = ${new_slot_id} AND trainer_id = ${trainer_id}
      `;
    }

    return result;
  } catch (error) {
    console.error("Error editing appointment:", error);
    throw new Error("Failed to edit appointment.");
  }
}

// Trainer Functions

export async function validateTrainer(email: string, fullname: string){ //trainer authentication
  //ensure only trainers can sigin into trainer Dashboard
  try{
    const result = await sql`
      SELECT trainer_id, fullname, email
      FROM trainers
      WHERE fullname = ${fullname} and email = ${email}
    `
    //console.log("Query Result:", result);  Log the query result
    return result.rows[0];
  } catch(error){ //error handling
    console.error("No encontramos su informacion", error);
    throw new Error("Error encontrando su informacion.");
  }
}

export async function trainerAppointments(trainer_id: number){
  // console.log("Received trainer_id:", trainer_id);

  try{ //fetches all the information of a trainer's appointment to be displayed
    const trainerApps = await sql<AppointmentQueryResult>`
    SELECT
    a.app_id AS app_id,
    c.fullname AS client_name,
    t.fullname AS trainer_fullname,
    ts.start_time AS starttime,
    ts.endtime AS endtime,
    l.level AS level,
    s.servicename AS service,
    a.date AS appointment_date,
    a.paidstatus as status
    FROM
        appointment_slots AS a
    INNER JOIN
        clients AS c ON a.client_id = c.id
    INNER JOIN
        trainers AS t ON a.trainer_id = t.trainer_id
    INNER JOIN
        time_slots AS ts ON a.slot_id = ts.slot_id
    INNER JOIN
        levels AS l ON a.level_id = l.level_id
    INNER JOIN
        services AS s ON a.service_id = s.service_id
    WHERE
        a.trainer_id = ${trainer_id}; 
    `;
    
    return trainerApps.rows;

  } catch(error){ //error handling
    console.error("No encontramos citas", error);
    throw new Error("Error encontrando sus citas.");
  }
}


export async function insertTrainerTimeSlot(trainer_id:number,slot_id:number,status:string,date:string){
  try{ //inserts a new trainer_time_slot on a given date and slot provided by the trainer
    const result = await sql`
    INSERT INTO trainer_time_slots(trainer_id,slot_id,status,date)
    VALUES (${trainer_id},${slot_id},${status},${date});
    `;
  } catch(error){
    console.error("No pudimos insertar las horas", error);
    throw new Error("Error insertando citas.");
  }

}

export async function fetchTimeSlots(){ //fetches the generic time slots for trainers
  try{
    const slots = await sql<TimeSlot>`
    SELECT slot_id, start_time AS starttime, endtime
    FROM time_slots;
    `;
    console.log("Slots fetched from data.ts:", slots);
    return slots.rows.map((row) => ({
      slot_id: row.slot_id ?? 0,
      starttime: row.starttime ?? 'Unknown',
      endtime: row.endtime ?? 'Unknown',
    }));
  }catch(error){ //error handling
    console.error("No encontramos los horarios");
    throw new Error("Error encontrando las horas");
  }
}

export async function fetchAvailableTrainerSlots(trainer_id:number){
  try{
   // console.log("Trainer id from fetch fnuction", trainer_id);
   //fetches trainer's available slots so they can keep track of unreserved hours
    const trainerSlots = await sql<TrainerSlots>`
      SELECT 
        tts.slot_id, 
        ts.start_time AS starttime, 
        ts.endtime, 
        tts.date, 
        tts.status
      FROM 
          trainer_time_slots tts
      JOIN 
          time_slots ts ON tts.slot_id = ts.slot_id
      WHERE 
          tts.trainer_id = ${trainer_id} 
          AND tts.status = 'Available'
      ORDER BY 
          tts.date ASC, 
          ts.start_time ASC;
    `;
    //console.log("trainerSlots: ",trainerSlots);
    return trainerSlots.rows.map((row) =>({
      slot_id: row.slot_id,
      starttime: row.starttime ?? 'Unknown',
      endtime: row.endtime ?? 'Unknown',
      date: row.date ?? 'Unknown',
      status: row.status ?? 'Unknown',
    }));
  } catch(error){
    console.error("Couldn't find available date");
    throw new Error("Error finding available dates");
  }
};

export async function deleteAvailableTrainerSlot(slot_id:number, date: string, trainer_id:number){
  try{ //deletes trainers time slots on trainer button click
    //console.log("Attempting to delete slot with:", { slot_id, date, trainer_id });
    const cancel = await sql`
      DELETE FROM trainer_time_slots 
      WHERE trainer_id = ${trainer_id} and slot_id = ${slot_id} and date = ${date};
      `;

  } catch(error){ //error handling
    console.error("Could not delete available time slot");
    throw new Error("Error deleting available slot");

  }
};

export async function trainerDeleteApp(app_id:number){
  try{ //deletes trainers appointment
    const cancel = await sql`
    DELETE FROM appointment_slots
    WHERE app_id = ${app_id};
    `;
  } catch(error){
    console.error("Could not delete appointment");
    throw new Error("Error deleting appointment");
  }
};
