import { pgTable, serial, text, foreignKey, integer, varchar, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const levels = pgTable("levels", {
	level_id: serial("level_id").primaryKey().notNull(),
	level: text("level").notNull(),
	description: text("description").notNull(),
});

export const appointment_slots = pgTable("appointment_slots", {
	app_id: integer("app_id").primaryKey().notNull(),
	slot_id: integer("slot_id").references(() => time_slots.slot_id),
	client_id: integer("client_id").references(() => clients.id),
	level_id: integer("level_id").references(() => levels.level_id),
	trainer_id: integer("trainer_id").references(() => trainers.trainer_id),
	service_id: integer("service_id").references(() => services.service_id),
	date: text("date").notNull(),
	paidstatus: varchar("paidstatus", { length: 20 }),
});

export const services = pgTable("services", {
	service_id: serial("service_id").primaryKey().notNull(),
	servicename: text("servicename").notNull(),
	description: text("description").notNull(),
});

export const clients = pgTable("clients", {
	id: serial("id").primaryKey().notNull(),
	fullname: text("fullname").notNull(),
	email: text("email").notNull(),
},
(table) => {
	return {
		unique_client_idx: uniqueIndex("unique_client_idx").using("btree", table.email),
	}
});

export const time_slots = pgTable("time_slots", {
	slot_id: serial("slot_id").primaryKey().notNull(),
	start_time: text("start_time").notNull(),
	endtime: text("endtime").notNull(),
});

export const trainers = pgTable("trainers", {
	trainer_id: serial("trainer_id").primaryKey().notNull(),
	fullname: text("fullname").notNull(),
	email: text("email").notNull(),
},
(table) => {
	return {
		unique_trainer_idx: uniqueIndex("unique_trainer_idx").using("btree", table.email),
	}
});

export const trainer_time_slots = pgTable("trainer_time_slots", {
	trainer_id: integer("trainer_id").references(() => trainers.trainer_id),
	slot_id: integer("slot_id").references(() => time_slots.slot_id),
	status: text("status").notNull(),
	date: text("date").notNull(),
});