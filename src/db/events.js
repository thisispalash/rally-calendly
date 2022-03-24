import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: String,
  slug: String,
  gate: String,
  qty: Number,
  nft: String,
  calendly: String
});

export const EventModel = mongoose.model('gated_event', EventSchema);

const AttendeeSchema = new mongoose.Schema({
  
});