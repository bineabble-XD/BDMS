import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

try {
  const connectionString = "mongodb+srv://admin:admin@btech.mun6zsy.mongodb.net/BDMS?appName=btech";
  mongoose.connect(connectionString);
  console.log("Database Connected..");
} catch (error) {
  console.log("Database connection error.." + error);
}


app.listen(5050, () => {
  console.log("Server connected at port number 5050..");
});