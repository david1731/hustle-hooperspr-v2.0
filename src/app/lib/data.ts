import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { AppointmentQueryResult, Trainer, TrainerSlots, Client,Service,Level} from './definitions';
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
        t.name AS trainer_name,
        t.lastname AS trainer_lastname,
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
        trainer_name: row.trainer_name ?? 'Unknown',
        trainer_lastname: row.trainer_lastname ?? 'Unknown',
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
    SELECT trainer_id, name, lastname, email FROM trainers;
    `;

  const result = data.rows.map((row) => ({
    trainer_id: row.trainer_id ?? 0,
    name: row.name ?? 'Unknown',
    lastname: row.lastname ?? 'Unknown',
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

//Used to display a given trainer's available hours
export async function fetchSlotByTrainerID(trainer_id: number){
  try{
    const data = await sql<TrainerSlots>`
    SELECT 
      tts.slot_id,
      ts.start_time,
      ts.endtime,
      tts.date
    FROM 
      trainer_time_slots tts
    JOIN 
      time_slots ts ON tts.slot_id = ts.slot_id
    WHERE 
      tts.trainer_id = ${trainer_id};
  `;
  const results = data.rows.map((row) => ({
    slot_id : row.slot_id ?? 0,
    start_time : row.start_time ?? 'Unknown',
    endtime : row.endtime ?? 'Unknown',
    date : row.date ?? 'Unknown',
  }))
  return results;
  } catch(error){
    console.error("Error fetching slots",error)
    throw new Error("Failed to fetch slots")
  }
}

export async function fetchClientByEmail(email: string): Promise<Client> {
  try {
    const data = await sql<Client>`
    SELECT client_id, fullname, email FROM clients WHERE email = ${email};
    `;
    if (data.rows.length === 0) {
      throw new Error('Client not found');
    }
    return data.rows[0];
  } catch (error) {
    console.error('Error fetching client', error);
    throw new Error('Failed to fetch client');
  }
}

export async function fetchServices(){
  try {
    const data = await sql<Service>`
    SELECT service_id, servicename, description FROM services;
    `;
    if (data.rows.length === 0) {
      throw new Error('Service not found');
    }
    const results = data.rows.map((row) => ({
      service_id : row.service_id ?? 0,
      servicename : row.servicename ?? 'Unknown',
      description : row.description ?? 'Unknown',
    }))
    return results;
  } catch (error) {
    console.error('Error fetching service', error);
    throw new Error('Failed to fetch service');
  }
}


export async function fetchLevels(){
  try {
    const data = await sql<Level>`
    SELECT level_id, level, description FROM levels;
    `;
    if (data.rows.length === 0) {
      throw new Error('Level not found');
    }
    const results = data.rows.map((row) => ({
      level_id : row.level_id ?? 0,
      level : row.level ?? 'Unknown',
      description : row.description ?? 'Unknown',
    }))
    return results;
  } catch (error) {
    console.error('Error fetching service', error);
    throw new Error('Failed to fetch service');
  }
}