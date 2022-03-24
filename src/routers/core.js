import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/home', (req, res) => {
  console.log('going home..');
  res.render('home');
});

export default router;