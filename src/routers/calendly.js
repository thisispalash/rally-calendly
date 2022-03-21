import express from "express";
import CalendlyClient from '../calendly';
import { addToDB, updateDB } from "../db";

const router = express.Router();

router.get('/auth', (req, res) => {
  let url = CalendlyClient.authorize();
  res.redirect(url);
});

router.get('/callback', async (req, res) => {
  let code = req.query.code;
  try {
    let data = await CalendlyClient.tokenize(code);
    await addToDB('CalendlyAccess', data);
    data = await calendlyClient.getUser(data.token_type, data.access_token, data.owner);
    await updateDB('CalendlyAccess', { owner: data.owner }, data);
    res.send(data.slug);
  } catch (err) {
    console.log(err);
  }
});

router.post('/refresh', async (req, res) => {
  let user = req.body.slug;
  try {
    let doc = await findInDB('CalendlyAccess', { slug: user });
    let data = await CalendlyClient.refresh(doc.refresh_token);
    await updateDB('CalendlyAccess', { slug: user }, data);
    res.send(data.expires_at);
  } catch (err) {
    console.log(err);
  }
});

export default router;