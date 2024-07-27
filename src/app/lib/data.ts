import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { AppointmentQueryResult, Trainer, TrainerSlots, updateTimeSlot, InfoFromAppointments} from './definitions';
import { ClientsTable, AppointmentSlotsTable, TrainersTable, ServicesTable, TimeSlotsTable, LevelsTable } from '../../../drizzle/schema';

import { config } from 'dotenv';
config();
const db = drizzle(sql, {
  schema: {
    clients: ClientsTable,
    trainers: TrainersTable,
    services: ServicesTable,
    time_slots: TimeSlotsTable,
    levels: LevelsTable,
    trainer_time_slots: TimeSlotsTable,
    appointment_slots: AppointmentSlotsTable,
  }
});

export async function getUserAppointmentsByEmail(email: string){
  try {
    const data = await sql<AppointmentQueryResult>`
      SELECT 
        a.app_id,
        c.fullname AS client_name,
        t.fullname AS trainer_fullname,
        ts.start_time AS starttime,
        ts.endtime AS endtime,
        l.level AS level,
        s.servicename AS service,
        a.date AS appointment_date
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
    
    console.log('Query Result:', data); // Log the query result
    const appointments = data.rows.map((row) => ({
        app_id: row.app_id ?? 0,
        client_name: row.client_name ?? 'Unknown',
        trainer_fullname: row.trainer_fullname ?? 'Unknown',
        starttime: row.starttime ?? 'Unknown',
        endtime: row.endtime ?? 'Unknown',
        level: row.level ?? 'Unknown',
        service: row.service ?? 'Unknown',
        appointment_date: row.appointment_date ?? 'Unknown',
      
    }));
    return appointments;
  } catch (error) {
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
  app_date: string){
    try {
      console.log("Creating appointment with:", {
        slot_id,
        email,
        level_id,
        trainer_id,
        service_id,
        app_date
      });
      const result = await sql`
      WITH client AS (
        SELECT id FROM clients WHERE email = ${email}
      )
      INSERT INTO appointment_slots (slot_id, client_id, level_id, trainer_id, service_id, date)
      SELECT ${slot_id}, id, ${level_id}, ${trainer_id}, ${service_id}, ${app_date}
      FROM client
      RETURNING *;
    `;
  
      console.log('Insert Result:', result);
      return result;
    } catch (error) {
      console.error('Error inserting appointment:', error);
      throw new Error('Failed to create appointment.');
    }
  }
    

export async function fetchTrainers(){
  try{
    const data = await sql<Trainer>`
    SELECT trainer_id, fullname, email FROM trainers;
    `;

  const result = data.rows.map((row) => ({
    trainer_id: row.trainer_id ?? 0,
    fullname: row.fullname ?? 'Unknown',
    email: row.email ?? 'Unknown',
    }));
    
    return result;
  } catch (error) {
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
  try {
    const result = await sql<updateTimeSlot>`
      UPDATE trainer_time_slots
      SET status = ${new_status}
      WHERE slot_id = ${slot_id}
        AND trainer_id = ${trainer_id}
        AND date = ${date};
    `;

    console.log('Update Result:', result);
  } catch (error) {
    console.error('Error updating time slot status:', error);
    throw new Error('Failed to update time slot status.');
  }
}

export async function cancelAppointment(app_id: number){
  try{
    const result = await sql`
      DELETE from appointment_slots WHERE app_id = ${app_id};    
    `;
  } catch(error){
    console.error("Error deleting appointment", error);
    throw new Error("Error deleting appointment.");
  }

}

export async function fetchSlots(trainerId: number, date: string){
  try {
    console.log(`Fetching slots for trainerId: ${trainerId}, date: ${date}, status: 'Available'`);
    const result = await sql<TrainerSlots>`
      SELECT 
      tts.slot_id, 
      ts.start_time AS start_time, 
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
      tts.slot_id ASC;
    
    `;
    console.log('fetchSlotByTrainerID result:', result);

    if (result.rows.length === 0) {
      throw new Error('No slots found');
    }

    return result.rows.map((row) => ({
      slot_id: row.slot_id ?? 0,
      start_time: row.start_time ?? 'Unknown',
      endtime: row.endtime ?? 'Unknown',
      date: row.date ?? 'Unknown',
      status: row.status ?? 'Unknown',
    }));
  } catch (error) {
    console.error('SQL query error:', error);
    throw new Error('Failed to execute SQL query');
  }
};

export async function fetchAvailableDates(trainerId:number){
  try {
    const result = await sql`SELECT DISTINCT date FROM trainer_time_slots WHERE trainer_id = ${trainerId} AND status = 'Available'`;
    return result.rows.map((row) => row.date);
  } catch (error) {
    console.error('Error fetching available dates:', error);
    return [];
  }
}

export async function fetchInfoFromAppointments(app_id: number){
  try{
    const info = await sql<InfoFromAppointments>`
    SELECT trainer_id, slot_id, date 
    FROM appointment_slots 
    WHERE app_id = ${app_id};
    `
    return info.rows.map((row)=>({
      trainer_id: row.trainer_id ?? 0,
      slot_id: row.slot_id ?? 0,
      date: row.date ?? 'Unknown'
    }));
  } catch(error){
    console.error("Error fetching info")
  }
}

export async function changeStatus(trainer_id: number, slot_id: number,date:string){
  try{
    const result = await sql`
    UPDATE trainer_time_slots SET status = 'Available'
    WHERE trainer_id = ${trainer_id} 
    AND slot_id = ${slot_id}
    AND date = ${date};
    `
  }catch(error){
    console.error("Error changing status", error);
    throw new Error("Error changing status.");
  }
}