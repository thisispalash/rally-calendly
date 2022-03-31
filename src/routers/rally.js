import express from 'express';
import { RallyClient } from '../clients/index.js';
import { addToDB } from '../db/index.js';
import { ErrRally } from '../utils/errors.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    let data = await RallyClient.register();
    res.status(200).send(data);
  } catch (err) {
    if (err == ErrRally.FailRegister) {
      res.status(401).json({
        message: 'Failed to register application. Please try again later.'
      });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

router.get('/auth', async (req, res) => {
  try {
    let url = await RallyClient.authorize();
    res.redirect(url);
  } catch (err) {
    if (err == ErrRally.NoToken) {
      let data = await RallyClient.register();
      if (data) res.redirect('/auth');
      else res.status(401).json({ message: 'No access token available for application. Please try again later.' });
    } else if (err == ErrRally.FailAuth) {
      res.status(401).json({
        message: 'User authentication failed. Please try again.'
      });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

router.get('/callback', async (req, res) => {
  let code = req.query.code;
  try {
    let data = await RallyClient.userID(code);
    data.isCreator = await RallyClient.checkCreator(data.userID);
    res.render('authR', data);
    await addToDB('RallyUser', data);
  } catch (err) {
    if (err == ErrRally.NoToken) {
      let data = await RallyClient.register();
      if (data) res.redirect(`/callback?code=${code}`);
      else res.status(401).json({ message: 'No access token available for application. Please try again later.' });
    } else if (err == ErrRally.CancelAuth) {
      res.status(401).json({
        message: 'User cancelled authentication to application.'
      });
    } else if (err == ErrRally.FailAuth) {
      res.status(401).json({
        message: 'User authentication failed. Please try again.'
      });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

router.get('/nfts/:token', async (req, res) => {
  let token = req.params.token;
  try {
    let data = await RallyClient.nfts(token);
    res.json(data);
  } catch (err) {
    if (err == ErrRally.NoToken) {
      let data = await RallyClient.register();
      if (data) res.redirect(`/nfts/${token}`);
      else res.status(401).json({ message: 'No access token available for application. Please try again later.' });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

router.get('/balance/:networkID/:token', async (req, res) => {
  let user = req.params.networkID;
  let token = req.params.token;
  try {
    let balance = await RallyClient.balance(user, token);
    if (balance < 0) {
      res.status(500).send('some error occured.')
    } else {
      res.status(200).json({ bal: balance });
    }
  } catch (err) {
    if (err == ErrRally.NoToken) {
      let data = await RallyClient.register();
      if (data) res.redirect(req.originalUrl);
      else res.status(401).json({ message: 'No access token available for application. Please try again later.' });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

router.get('/owned/:networkID/:nftID', async (req, res) => {
  let user = req.params.networkID;
  let nft = req.params.nftID;
  try {
    let owned = await RallyClient.isOwned(user, nft);
    res.json({ owned: owned });
  } catch (err) {
    if (err == ErrRally.NoToken) {
      let data = await RallyClient.register();
      if (data) res.redirect(req.originalUrl);
      else res.status(401).json({ message: 'No access token available for application. Please try again later.' });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

router.get('/user/:userID', async (req, res) => {
  let user = req.params.userID;
  try {
    let data = await RallyClient.getUser(user);
    if (data) res.status(200).json(data);
    else res.status(500).json({ message: 'Some error occured.' });
  } catch (err) {
    if (err == ErrRally.NoToken) {
      let data = await RallyClient.register();
      if (data) res.redirect(req.originalUrl);
      else res.status(401).json({ message: 'No access token available for application. Please try again later.' });
    } else {
      console.log(err);
      // TODO send error to client
    }
  }
});

export default router;