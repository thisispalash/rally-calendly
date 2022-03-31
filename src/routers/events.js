import express from "express";
import { addToDB, findInDB, findAllInDB, getFromDB, updateDB } from "../db/index.js";

const router = express.Router();

router.post('/new', async (req, res) => {
  let data = req.body;
  if (process.env.ENV !== 'dev') {
    let rallyDoc = await findInDB('RallyUser', { networkID: data.rallyNetworkID });
    if (rallyDoc.tokenSymbol === 'false' || data.tokenSymbol != rallyDoc.isCreator) {
      res.send(`Unauthorized to schedule an event for ${data.tokenSymbol}`);
      return;
    }
  }
  try {
    await findInDB('GatedEvent', { calendly: data.eventOptions }); // throws ErrDB.NotFound if doc not found
    res.send('Gated event for the selected event type already exists');
  } catch (err) {
    let doc = {
      name: data.gateName,
      slug: data.calendlySlug,
      gate: data.gateType,
      token: data.tokenSymbol,
      qty: data.qty,
      nft: data.nftOptions,
      calendly: data.eventOptions
    }
    await addToDB('GatedEvent', doc);
    res.send(`Gated event ${doc.name} added to database successfully`);
  }
});

router.get('/get/:token', async (req, res) => {
  let token = req.params.token;
  if (token === 'false') {
    res.json([]);
  } else {
    let data = await findAllInDB('GatedEvent', { token: token });
    res.json(data);
  }
});

router.get('/all/:token', async (req, res) => {
  let token = req.params.token;
  let data = await getFromDB('GatedEvent');
  if (token === 'false') {
    res.json(data);
  } else {
    res.json(data.filter(obj => obj.token !== token));
  }
});

router.post('/update/:id', async (req,res) => {
  let id = req.params.id;
  let data = req.body;
  let doc = {
    name: data.gateName,
    slug: data.calendlySlug,
    gate: data.gateType,
    token: data.tokenSymbol,
    qty: data.qty,
    nft: data.nftOptions,
    calendly: data.eventOptions
  }
  await updateDB('GatedEvent', { _id: id }, doc);
  res.send(`updated event ${doc.name}`);
});

router.post('/book/:id', async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  let doc = {
    eventID: id,
    rallyUserID: data.rallyUserID,
    schedule: data.calendlyScheduledEvent,
    invitee: data.calendlyScheduledInvitee
  }
  try {
    await addToDB('EventAttendee', doc);
    res.send('Invitee successfully added to db');
  } catch (err) {
    console.log(err);
    res.send('Error occurred in adding to DB');
  }
});

router.get('/scheduled/:rallyUserID', async (req, res) => {
  let user = req.params.rallyUserID;
  let data = await findAllInDB('EventAttendee', { rallyUserID: user });
  res.json(data);
});

router.get('/get/id/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let data = await findInDB('GatedEvent', { _id: id });
    res.json(data);
  } catch (err) {
    // this should never happen
    console.log(err);
  }
});

router.get('/get/attendees/:id', async (req, res) => {
  let id = req.params.id;
  let data = await findAllInDB('EventAttendee', { eventID: id });
  res.json(data);
});

export default router;