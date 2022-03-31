import mongoose from 'mongoose';

const RallyAccessSchema = new mongoose.Schema({
  userID: String,
  networkID: String,
  isCreator: String
});

export const RallyAccessModel = mongoose.model('rally_access', RallyAccessSchema);

const CalendlyAccessSchema = new mongoose.Schema({
  owner: String,
  name: String,
  slug: String,
  token_type: String,
  access_token: String,
  refresh_token: String,
  created_at: Date,
  expires_at: Date
});

export const CalendlyAccessModel = mongoose.model('calendly_access', CalendlyAccessSchema);