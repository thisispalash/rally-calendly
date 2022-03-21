import express from "express";
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/home', (req, res) => {

});

export default router;