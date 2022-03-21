import express from 'express';
import { RallyClient } from '../clients/index.js';
import { addToDB } from '../db/index.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    let data = await RallyClient.register();
  } catch (err) {
    console.log(err);
  }
});

router.post('/auth', async (req, res) => {
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
    await addToDB('RallyUser', data);
  } catch (err) {
    console.log(err);
  }
});

export default router;