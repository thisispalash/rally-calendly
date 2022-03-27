import express from "express";
import { addToDB, findInDB, updateDB } from "../db/index.js";

const router = express.Router();

router.post('/new', async (req, res) => {
  let data = req.body;
  // let rallyDoc = await findInDB('RallyUser', { networkID: data.rallyNetworkID });
  // if (rallyDoc.tokenSymbol === 'false' || data.tokenSymbol != rallyDoc.isCreator) {
  //   res.send(`Unauthorized to schedule an event for ${data.tokenSymbol}`);
  //   return;
  // }
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
  console.log(`fetching events for ${token}`)
  if (token === 'false') {
    res.json([]);
    return;
  }
  try {
    let data = await findInDB('GatedEventAll', { token: token });
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get('/all/:token', async (req, res) => {
  let token = req.params.token;
  try {
    let data = await findInDB('GatedEventAll', {});
    if (token == 'false') {
      res.json(data);
      return;
    }
    let ret = [];
    data.forEach( doc => {
      if (doc.token == token) return;
      ret.push(doc);
    })
    res.json(ret);
  } catch (err) {
    console.log(err);
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
  res.send(`updated event ${data.name}`);
});

router.post('/schedule/:id', async (req, res) => {
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

export default router;