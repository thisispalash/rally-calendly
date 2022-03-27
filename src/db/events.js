import mongoose from 'mongoose';

const GatedEventSchema = new mongoose.Schema({
  name: String,
  slug: String,
  gate: String,
  token: String,
  qty: Number,
  nft: String,
  calendly: String
});

export const GatedEventModel = mongoose.model('gated_event', GatedEventSchema);

const AttendeeSchema = new mongoose.Schema({
  eventID: String,
  rallyUserID: String,
  schedule: String,
  invitee: String
});

export const AttendeeModel = mongoose.model('event_attendee', AttendeeSchema);