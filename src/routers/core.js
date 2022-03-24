import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/home', (req, res) => {
  console.log('going home..');
  res.render('home');
});

// Breaking changes

router.get('/calendly-callback', (req, res) => {
  res.redirect(`/calendly/callback?code=${req.query.code}`);
});

export default router;