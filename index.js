import mongoose from 'mongoose';
import app from './src/app.js';
import 'dotenv/config';

try {
  // ensure `mongod` is running
  await mongoose.connect('mongodb://localhost:27017/rally-gatr');
  console.log('MongoDB up and running!')
} catch (err) {
  console.log('Failed to start MongoDB');
  console.log(err);
}

const port = parseInt(process.env.PORT) || 5555

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})