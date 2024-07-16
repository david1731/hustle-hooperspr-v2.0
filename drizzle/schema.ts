import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
 
export const ClientsTable = pgTable(
    'clients',
    {
        client_id: serial('id').primaryKey(),
        fullname: text('fullname').notNull(),
        email: text('email').notNull(),
        
    },
    (clients) => {
        return {
            uniqueIdx: uniqueIndex('unique_client_idx').on(clients.email),
        };
    },
);

export const TrainersTable = pgTable(
    'trainers',
    {
        trainer_id: serial('trainer_id').primaryKey(),
        name: text('name').notNull(),
        lastname: text('lastname').notNull(),
        email: text('email').notNull(),
    },
    (trainers) => {
        return {
            uniqueIdx: uniqueIndex('unique_trainer_idx').on(trainers.email),
        };
    },
);

export const ServicesTable = pgTable(
    'services',
    {
        service_id: serial('service_id').primaryKey(),
        servicename: text('servicename').notNull(),
        description: text('description').notNull(),
    },
);

export const TimeSlotsTable = pgTable(
    'time_slots',
    {
        slot_id: serial('slot_id').primaryKey(),
        starttime: text('start_time').notNull(),
        endtime: text('endtime').notNull(),
        status: text('status').notNull(),
    },
);

export const LevelsTable = pgTable(
    'levels',
    {
        level_id: serial('level_id').primaryKey(),
        level: text('level').notNull(),
        description: text('description').notNull(),
    },
);

export const TrainerTimeSlotsTable = pgTable(
    'trainer_time_slots',
    {
      trainer_id: integer('trainer_id').references(() => TrainersTable.trainer_id),
      slot_id: integer('slot_id').references(() => TimeSlotsTable.slot_id),
    },
);   

export const AppointmentSlotsTable = pgTable(
    'appointment_slots',
    {
      app_id: serial('app_id').primaryKey(),
      slot_id: integer('slot_id').references(() => TimeSlotsTable.slot_id),
      client_id: integer('client_id').references(() => ClientsTable.client_id),
      level_id: integer('level_id').references(() => LevelsTable.level_id),
      trainer_id: integer('trainer_id').references(() => TrainersTable.trainer_id),
      service_id: integer('service_id').references(() => ServicesTable.service_id),
      date: timestamp('date').notNull(),
    },
);