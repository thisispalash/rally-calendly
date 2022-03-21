import express from 'express';
import { RallyClient } from '../clients/index.js';
import { addToDB } from '../db/index.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    let data = await RallyClient.register();
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

router.get('/auth', async (req, res) => {
  try {
    let url = await RallyClient.authorize();
    res.redirect(url);
  } catch (err) {
    console.log(err);
  }
});

router.get('/callback', async (req, res) => {
  let code = req.query.code;
  try {
    let data = await RallyClient.userID(code);
    data.isCreator = await RallyClient.checkCreator(data.userID);
    res.render('auth', data);
    await addToDB('RallyUser', data);
  } catch (err) {
    console.log(err);
  }
});

export default router;