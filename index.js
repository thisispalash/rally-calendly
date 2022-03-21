import mongoose from 'mongoose';
import app from './src/app.js';
import 'dotenv/config';

try {
  // ensure `mongod` is running
  const conn = await mongoose.connect('mongodb://localhost:27017/rally-gatr');
  if (process.env.ENV === 'dev') await conn.connection.db.dropDatabase(); // for easier testing
  console.log('MongoDB up and running!')
} catch (err) {
  console.log('Failed to start MongoDB');
  console.log(err);
}

const port = parseInt(process.env.PORT) || 5555

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})