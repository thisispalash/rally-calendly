'use strict';

import mongoose from 'mongoose';

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

const CalendlyAccessModel = mongoose.model('calendly_access', CalendlyAccessSchema);

module.exports = { CalendlyAccessModel };