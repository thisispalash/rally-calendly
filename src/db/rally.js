import mongoose from 'mongoose';

const RallyUserSchema = new mongoose.Schema({
  userID: String,
  networkID: String,
  isCreator: Boolean
});

export const RallyUserModel = mongoose.model('rally_user', RallyUserSchema);