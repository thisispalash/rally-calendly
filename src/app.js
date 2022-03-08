'use strict';

const express = require('express');
const path = require('path');

const { rallyClient } = require('./rally');


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
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

app.get('/home', async (req, res) => {

});


module.exports = { app }