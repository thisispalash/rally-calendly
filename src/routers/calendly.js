import express from 'express';

import { CalendlyClient } from '../clients/index.js';
import { addToDB, findInDB, updateDB } from '../db/index.js';
import { ErrDB, ErrCalendly } from '../utils/errors.js';

const router = express.Router();

router.get('/auth', (req, res) => {
  let url = CalendlyClient.authorize();
  res.redirect(url);
});

router.get('/callback', async (req, res) => {
  let code = req.query.code;
  try {
    let data = await CalendlyClient.tokenize(code);
    await addToDB('CalendlyAccess', data); // throws errDB.Exists
    data = await CalendlyClient.getUser(data.token_type, data.access_token, data.owner);
    await updateDB('CalendlyAccess', { owner: data.owner }, data);
    res.render('authC', { slug: data.slug });
  } catch (err) {
    if (err === ErrDB.Exists) {
      await updateDB('CalendlyAccess', { owner: data.owner }, data);
      res.render('authC', { slug: data.slug });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

router.post('/refresh', async (req, res) => {
  let user = req.body.slug;
  try {
    let doc = await findInDB('CalendlyAccess', { slug: user }); // throws ErrDB.NotFound
    let data = await CalendlyClient.refresh(doc.refresh_token); // throws ErrCalendly.FailRefresh
    await updateDB('CalendlyAccess', { slug: user }, data);
    res.status(200).json({
      slug: user,
      message: 'Access token successfully refreshed.',
      expiry: data.expires_at
    });
  } catch (err) {
    if (err === ErrDB.NotFound) {
      res.status(404).json({
        slug: user,
        message: 'No user found for provided slug.'
      });
    } else if (err === ErrCalendly.FailRefresh) {
      res.status(401).json({
        slug: user,
        message: 'Failed to refresh access token. Please try again later.'
      });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

router.get('/events/:slug', async (req, res) => {
  let user = req.params.slug;
  try {
    let doc = await findInDB('CalendlyAccess', { slug: user }); // throws ErrDB.NotFound
    let data = await CalendlyClient.getEvents(doc.token_type, doc.access_token, doc.owner); // throws ErrCalendly.ExpiredToken
    res.json(data);
  } catch (err) {
    if (err === ErrDB.NotFound) {
      res.status(404).json({
        slug: user,
        message: 'No user found for provided slug.'
      });
    } else if (err === ErrCalendly.ExpiredToken) {
      res.status(401).json({
        slug: user,
        message: 'Access token expired. Please call /calendly/refresh',
        expired: doc.expires_at
      });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

router.get('/single/:slug/:id', async (req, res) => {
  let user = req.params.slug;
  let id = req.params.id;
  let event = undefined;
  try {
    event = await findInDB('GatedEvent', { _id: id });
  } catch (err) {
    if (err === ErrDB.NotFound) { // this should never happen
      res.status(404).json({
        eventID: id,
        message: 'Event not found in database.'
      });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
  try {
    let access = await findInDB('CalendlyAccess', { slug: user });
    let url = await CalendlyClient.getSchedulingLink(access.token_type, access.access_token, event.calendly);
    res.status(200).send(url);
  } catch (err) {
    if (err === ErrDB.NotFound) {
      res.status(404).json({
        slug: user,
        message: 'No user found for provided slug.'
      });
    } else if (err === ErrCalendly.ExpiredToken) {
      res.status(401).json({
        slug: user,
        message: 'Access token expired. Please call /calendly/refresh',
        expired: doc.expires_at
      });
    }
    console.log(err);
  }
});

export default router;