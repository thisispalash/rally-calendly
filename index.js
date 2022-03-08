'use strict';

require('dotenv').config();

const { app } = require('./src/app');
const port = parseInt(process.env.PORT) || 5555

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})