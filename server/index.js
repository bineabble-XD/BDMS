// index.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
//mport donorModel from './models/Donor.jsx';       // ⬅️ import the model (from Donor.js)

const app = express();
app.use(cors());
app.use(express.json());

try {
  const connectionString =
    'mongodb+srv://admin:admin@btech.mun6zsy.mongodb.net/BDMS?appName=btech';

  // if your Node version supports it, this can be top-level await
  await mongoose.connect(connectionString);
  console.log('Database Connected..');
} catch (error) {
  console.log('Database connection error.. ' + error);
}

/* ----------  REGISTER DONOR API  ---------- */
app.post('/api/donors', async (req, res) => {
  try {
    // req.body should contain: fullName, password, phoneNumber, age, gender, bloodType, role, email, address
   //const donor = new donorModel(req.body);
    await donor.save();

    res.status(201).json({ message: 'Donor registered successfully' });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: 'Error registering donor', error: err.message });
  }
});

app.listen(5050, () => {
  console.log('Server connected at port number 5050..');
});
