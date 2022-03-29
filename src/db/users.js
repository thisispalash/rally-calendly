import mongoose from 'mongoose';

const GatrUserSchema = new mongoose.Schema({
  rallyUserID: String,
  rallyNetworkID: String,
  rallyCreator: String,
  calendlySlug: String
});

export const GatrUserModel = mongoose.model('user', GatrUserSchema);