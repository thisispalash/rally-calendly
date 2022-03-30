import express from 'express';
import { addToDB, updateDB } from '../db/index.js';
import { ErrDB } from '../utils/errors.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/home', async (req, res) => {
  let form = req.body;
  if (form.formName === 'rallyLoginForm') {
    // User has just logged into application with RallyIO
    let data = {
      rallyUserID: form.rallyUserID,
      rallyNetworkID: form.rallyNetworkID,
      rallyCreator: form.isCreator
    }
    try {
      await addToDB('GatrUser', data);
    } catch (err) {
      console.log(err);
    } finally {
      data.calendlySlug = undefined;
      res.render('home-new', data);
    }
  } else if (form.formName === 'calendlyLoginForm') {
    // User has just logged into Calendly
    let data = {
      rallyUserID: form.rallyUserID,
      rallyNetworkID: form.rallyNetworkID,
      rallyCreator: form.isCreator,
      calendlySlug: form.calendlySlug
    }
    await updateDB('GatrUser', { rallyUserID: data.rallyUserID }, data);
    res.render('home-new', data);
  } else {
    res.status(403).json({
      message: 'Unsupported form sent to this path',
      data: req.body
    });
  }
});

export default router;