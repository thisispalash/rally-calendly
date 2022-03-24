import express from "express";
import { addToDB, findInDB, updateDB } from "../db/index.js";

const router = express.Router();

router.post('/new-event', async (req, res) => {
  let data = req.body;
  console.log(data);
  // TODO add to db
  res.render('home');
});


export default router;