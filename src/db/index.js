import { CalendlyAccessModel } from './calendly.js';
import { RallyUserModel } from './rally.js';
import { GatedEventModel } from './events.js';

import { ErrDB } from '../utils/errors.js';

export const addToDB = async (model, data) => {
  let res = undefined;
  switch (model) {
    case 'CalendlyAccess':
      res = await CalendlyAccessModel.find({ owner: data.owner });
      if (res[0]) throw ErrDB.Exists;
      await CalendlyAccessModel.create(data);
      break;
    case 'RallyUser':
      res = await RallyUserModel.find({ userID: data.userID });
      if (res[0]) throw ErrDB.Exists;
      await RallyUserModel.create(data);
      break;
    case 'GatedEvent':
      res = await GatedEventModel.find({ calendly: data.calendly });
      if (res[0]) throw ErrDB.Exists;
      await GatedEventModel.create(data);
      break;
  }
}

export const updateDB = async (model, filter, data) => {
  switch (model) {
    case 'CalendlyAccess':
      await CalendlyAccessModel.updateOne(filter, data);
      break;
    case 'GatedEvent':
      await GatedEventModel.updateOne(filter, data);
      break;
  }
}

export const findInDB = async (model, query) => {
  let data = undefined;
  switch (model) {
    case 'CalendlyAccess':
      data = await CalendlyAccessModel.findOne(query);
      if (!data) throw ErrDB.NotFound;
      return data;
    case 'GatedEvent':
      data = await GatedEventModel.findOne(query);
      if (!data) throw ErrDB.NotFound;
      return data;
  }
}