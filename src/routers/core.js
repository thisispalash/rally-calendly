import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/home', (req, res) => {
  console.log('going home..')
  let data = req.body;
  if (data.isCreator === 'true') res.render('creator');
  else res.render('user');
});

export default router;