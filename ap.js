require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017,localhost:27018,localhost:27019/abc?replicaSet=rs0';

let db;

// Connect to MongoDB
async function connectDB() {
  const client = new MongoClient(DB_URI);
  await client.connect();
  db = client.db('Assignment');
  console.log('Connected to MongoDB');
}

// Routes
// 1. POST - Create employee
app.post('/employees', async (req, res) => {
  try {
    const result = await db.collection('adeyemi_finalproject').insertMany(req.body);
    res.status(201).json({
      success: true,
      insertedId: result.insertedId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET - All employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await db.collection('adeyemi_finalproject').find().toArray();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET - Single employee by ID
app.get('/employees/:id', async (req, res) => {
  try {
    const employee = await db.collection('adeyemi_finalproject').findOne({
      employee_id: req.params.id
    });
    employee ? res.json(employee) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. PUT - Update employee
app.put('/employees/:id', async (req, res) => {
  try {
    const result = await db.collection('adeyemi_finalproject').updateOne(
      { employee_id: req.params.id },
      { $set: req.body }
    );
    res.json({
      success: result.modifiedCount > 0,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE - Remove employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const result = await db.collection('adeyemi_finalproject').deleteOne({
      employee_id: req.params.id
    });
    res.json({
      success: result.deletedCount > 0,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

 });
});