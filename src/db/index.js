import { CalendlyAccessModel } from './calendly';
import { RallyUserModel } from './rally';

import { ErrDB } from '../utils/errors';

export const addToDB = async (model, data) => {
  switch (model) {
    case 'CalendlyAccess':
      let res = await CalendlyAccessModel.find({ owner: data.owner });
      if (res[0]) throw ErrDB.Exists;
      await CalendlyAccessModel.create(data);
      break;
    case 'RallyUser':
      let res = await RallyUserModel.find({ userID: data.userID });
      if (res[0]) throw ErrDB.Exists;
      await RallyUserModel.create(data);
      break;
  }
}

export const updateDB = async (model, filter, data) => {
  switch (model) {
    case 'CalendlyAccess':
      await CalendlyAccessModel.updateOne(filter, data);
      break;
  }
}

export const findInDB = async (model, query) => {
  switch (model) {
    case 'CalendlyAccess':
      let data = CalendlyAccessModel.findOne(query);
      if (!data) throw ErrDB.NotFound;
      return data;
  }
}