'use strict';

import mongoose from 'mongoose';
import { CalendlyAccessModel } from './calendly';

const ErrAlreadyExists = new Error('Key already exists in DB. Update instead.');
const ErrNoEntry = new Error('No document found with the given query');

const addToDB = async (model, data) => {
  switch (model) {
    case 'CalendlyAccess':
      let res = await CalendlyAccessModel.find({ owner: data.owner });
      if (res[0]) throw ErrAlreadyExists;
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
      if (!data) throw ErrNoEntry;
      return data;
  }
}

module.exports = { addToDB, updateDB };