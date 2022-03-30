import { CalendlyAccessModel } from './calendly.js';
import { RallyUserModel } from './rally.js';
import { GatedEventModel, AttendeeModel } from './events.js';
import { GatrUserModel } from './users.js';

import { ErrDB } from '../utils/errors.js';

export const addToDB = async (model, data) => {
  let query = undefined;
  switch (model) {
    case 'CalendlyAccess':
      model = CalendlyAccessModel;
      query = { owner: data.owner };
      break;
    case 'RallyUser':
      model = RallyUserModel;
      query = { userID: data.userID };
      break;
    case 'GatedEvent':
      model = GatedEventModel;
      query = { calendly: data.calendly };
      break;
    case 'EventAttendee':
      model = AttendeeModel;
      query = { schedule: data.schedule };
      break;
    case 'GatrUser':
      model = GatrUserModel;
      query = { rallyUserID: data.rallyUserID };
  }
  let doc = await model.findOne(query);
  if (doc) throw ErrDB.Exists;
  doc = await model.create(data);
  return doc;
}

export const updateDB = async (model, filter, data) => {
  switch (model) {
    case 'CalendlyAccess':
      model = CalendlyAccessModel;
      break;
    case 'RallyUser':
      model = RallyUserModel;
      break;
    case 'GatedEvent':
      model = GatedEventModel;
      break;
    case 'EventAttendee':
      model = AttendeeModel;
      break;
    case 'GatrUser':
      model = GatrUserModel;
      break;
  }
  const res = model.updateOne(filter, data);
  return res;
}

export const findInDB = async (model, query) => {
  switch (model) {
    case 'CalendlyAccess':
      model = CalendlyAccessModel;
      break;
    case 'RallyUser':
      model = RallyUserModel;
      break;
    case 'GatedEvent':
      model = GatedEventModel;
      break;
    case 'EventAttendee':
      model = AttendeeModel;
      break;
    case 'GatrUser':
      model = GatrUserModel;
      break;
  }
  const data = await model.findOne(query);
  if (!data) throw ErrDB.NotFound;
  return data;
}

export const findAllInDB = async (model, query) => {
  switch (model) {
    case 'CalendlyAccess':
      model = CalendlyAccessModel;
      break;
    case 'RallyUser':
      model = RallyUserModel;
      break;
    case 'GatedEvent':
      model = GatedEventModel;
      break;
    case 'EventAttendee':
      model = AttendeeModel;
      break;
    case 'GatrUser':
      model = GatrUserModel;
      break;
  }
  return await model.find(query);
}

export const getFromDB = async (model) => {
  switch (model) {
    case 'CalendlyAccess':
      model = CalendlyAccessModel;
      break;
    case 'RallyUser':
      model = RallyUserModel;
      break;
    case 'GatedEvent':
      model = GatedEventModel;
      break;
    case 'EventAttendee':
      model = AttendeeModel;
      break;
    case 'GatrUser':
      model = GatrUserModel;
      break;
  }
  return await model.find();
}