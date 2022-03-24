import express from "express";
import { addToDB, findInDB, updateDB } from "../db/index.js";

const router = express.Router();

router.post('/new', async (req, res) => {
  let data = req.body;
  console.log(data);
  // TODO add to db
  res.render('home');
});

router.post('/schedule', async (req, res) => {

});

export default router;