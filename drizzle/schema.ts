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
        clientID: serial('id').primaryKey(),
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
        trainerID: serial('trainerID').primaryKey(),
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
        serviceID: serial('serviceID').primaryKey(),
        serviceName: text('serviceName').notNull(),
        description: text('description').notNull(),
    },
);

export const TimeSlotsTable = pgTable(
    'timeSlots',
    {
        slotID: serial('slotID').primaryKey(),
        startTime: timestamp('startTime').notNull(),
        endTime: timestamp('endTime').notNull(),
        status: text('status').notNull(),
    },
);

export const LevelsTable = pgTable(
    'levels',
    {
        levelID: serial('levelID').primaryKey(),
        level: text('level').notNull(),
        description: text('description').notNull(),
    },
);

export const TrainerTimeSlotsTable = pgTable(
    'trainerTimeSlots',
    {
      trainerID: integer('trainerID').references(() => TrainersTable.trainerID),
      slotID: integer('slotID').references(() => TimeSlotsTable.slotID),
    },
);   

export const AppointmentSlotsTable = pgTable(
    'appointmentSlots',
    {
      appID: serial('appID').primaryKey(),
      slotID: integer('slotID').references(() => TimeSlotsTable.slotID),
      clientID: integer('clientID').references(() => ClientsTable.clientID),
      levelID: integer('levelID').references(() => LevelsTable.levelID),
      trainerID: integer('trainerID').references(() => TrainersTable.trainerID),
      serviceID: integer('serviceID').references(() => ServicesTable.serviceID),
      date: timestamp('date').notNull(),
    },
);