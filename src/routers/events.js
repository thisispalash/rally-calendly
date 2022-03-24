import express from "express";
import { addToDB, findInDB, updateDB } from "../db/index.js";

const router = express.Router();

router.post('/new', async (req, res) => {
  let data = req.body;
  let rallyDoc = await findInDB('RallyUser', { networkID: data.rallyNetworkID });
  if (data.tokenSymbol === 'false' || data.tokenSymbol === rallyDoc.isCreator) {
    res.send(`Unauthorized to schedule an event for ${data.tokenSymbol}`);
    return;
  }
  try {
    await findInDB('GatedEvent', { calendly: data.eventDoc }); // throws ErrDB.NotFound if doc not found
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
});

router.post('/schedule', async (req, res) => {

});

export default router;