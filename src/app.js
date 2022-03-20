'use strict';

const express = require('express');
const path = require('path');

const { rallyClient } = require('./rally');
const { calendlyClient } = require('./calendly');

import { addToDB, updateDB } from './db';

const app = express();

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'public')));


app.get('/', async (req, res) => {
  try {
    await rallyClient.register();
    res.render('index');
  } catch (err) {
    console.log(err);
    res.send('Application not registered');
  }
});

app.post('/authorize', async (req, res) => {
  try {
    let url = await rallyClient.authorize();
    res.redirect(url);
  } catch (err) {
    console.log(err);
  }
});

app.get('/callback', async (req, res) => {
  try {
    let code = req.query.code;
    let data = await rallyClient.userID(code);
    data.creator = await rallyClient.checkCreator(data.username);
    res.render('auth', data)
  } catch (err) {
    console.log(err);
  }
});

app.get('/user/:id', async (req, res) => {
  let rnbID = req.params.id;
  // TODO get held coins
  res.render('user');
});

app.get('/creator/:username', (req, res) => {
  res.render('creator');
})

app.get('/calendly-auth', async (req, res) => {
  let url = await calendlyClient.authorize();
  res.redirect(url);
});

app.get('/calendly-callback', async (req, res) => {
  try {
    let code = req.query.code;
    console.log(code);
    let data = await calendlyClient.tokenize(code);
    await addToDB('CalendlyAccess', data);
    let uuid = data.owner;
    data = await calendlyClient.getUser(data.token_type, data.access_token, uuid);
    await updateDB('CalendlyAccess', { owner: uuid }, data);
    res.send(data.slug);
  } catch (err) {
    console.log(err);
  }
});

app.get('/calendly-refresh', async (req, res) => {
  try {
    let user = req.query.slug;
    let doc = await findInDB('CalendlyAccess', { slug: user });
    let data = await calendlyClient.refresh(doc.refresh_token);
    await updateDB('CalendlyAccess', { slug: user }, data);
    res.send(data.expires_at);
  } catch (err) {
    console.log(err);
  }
})

module.exports = { app }