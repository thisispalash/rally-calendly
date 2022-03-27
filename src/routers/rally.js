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

router.get('/nfts/:token', async (req, res) => {
  let token = req.params.token;
  try {
    let data = await RallyClient.nfts(token);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get('/balance/:networkID/:asset/:identifier', async (req, res) => {
  let user = req.params.networkID;
  let asset = req.params.asset;
  let identifier = req.params.identifier;
  if (asset === 'token') {
    let bal = await RallyClient.balance(user, identifier);
    res.json({ qty: bal });
  } else {
    let owned = await RallyClient.isOwned(user, identifier);
    res.json({ owned: owned });
  }
});

export default router;