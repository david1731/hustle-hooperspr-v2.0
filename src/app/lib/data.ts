import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { AppointmentQueryResult } from './definitions';
import { ClientsTable, AppointmentSlotsTable, TrainersTable, ServicesTable, TimeSlotsTable, LevelsTable } from '../../../drizzle/schema';

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
        ts.starttime AS starttime,
        ts.endtime AS endtime,
        l.level AS level,
        s.servicename AS service,
        a.date AS appointment_date
      FROM 
        appointment_slots a
      JOIN 
        clients c ON a.client_id = c.client_id
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
      ...row,
      app_id: row.app_id,
      client_name: row.client_name,
      trainer_name: row.trainer_name,
      trainer_lastname: row.trainer_lastname,
      starttime: row.starttime,
      endtime: row.endtime,
      level: row.level,
      service: row.servicename,
      appointment_date: row.date,
    }));
    return appointments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user appointments.');
  }
}


