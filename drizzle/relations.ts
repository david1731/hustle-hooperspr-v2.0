import { relations } from "drizzle-orm/relations";
import { time_slots, appointment_slots, clients, levels, trainers, services, trainer_time_slots } from "./schema";

export const appointment_slotsRelations = relations(appointment_slots, ({one}) => ({
	time_slot: one(time_slots, {
		fields: [appointment_slots.slot_id],
		references: [time_slots.slot_id]
	}),
	client: one(clients, {
		fields: [appointment_slots.client_id],
		references: [clients.id]
	}),
	level: one(levels, {
		fields: [appointment_slots.level_id],
		references: [levels.level_id]
	}),
	trainer: one(trainers, {
		fields: [appointment_slots.trainer_id],
		references: [trainers.trainer_id]
	}),
	service: one(services, {
		fields: [appointment_slots.service_id],
		references: [services.service_id]
	}),
}));

export const time_slotsRelations = relations(time_slots, ({many}) => ({
	appointment_slots: many(appointment_slots),
	trainer_time_slots: many(trainer_time_slots),
}));

export const clientsRelations = relations(clients, ({many}) => ({
	appointment_slots: many(appointment_slots),
}));

export const levelsRelations = relations(levels, ({many}) => ({
	appointment_slots: many(appointment_slots),
}));

export const trainersRelations = relations(trainers, ({many}) => ({
	appointment_slots: many(appointment_slots),
	trainer_time_slots: many(trainer_time_slots),
}));

export const servicesRelations = relations(services, ({many}) => ({
	appointment_slots: many(appointment_slots),
}));

export const trainer_time_slotsRelations = relations(trainer_time_slots, ({one}) => ({
	trainer: one(trainers, {
		fields: [trainer_time_slots.trainer_id],
		references: [trainers.trainer_id]
	}),
	time_slot: one(time_slots, {
		fields: [trainer_time_slots.slot_id],
		references: [time_slots.slot_id]
	}),
}));