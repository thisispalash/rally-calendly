'use strict';

import mongoose from 'mongoose';
import { CalendlyAccessModel } from './calendly';

import { ErrDB } from '../utils/errors';

const addToDB = async (model, data) => {
  switch (model) {
    case 'CalendlyAccess':
      let res = await CalendlyAccessModel.find({ owner: data.owner });
      if (res[0]) throw ErrDB.Exists;
      await CalendlyAccessModel.create(data);
      break;
  }
}

const updateDB = async (model, filter, data) => {
  switch (model) {
    case 'CalendlyAccess':
      await CalendlyAccessModel.updateOne(filter, data);
      break;
  }
}

const findInDB = async (model, query) => {
  switch (model) {
    case 'CalendlyAccess':
      let data = CalendlyAccessModel.findOne(query);
      if (!data) throw ErrDB.NotFound;
      return data;
  }
}

module.exports = { addToDB, updateDB };