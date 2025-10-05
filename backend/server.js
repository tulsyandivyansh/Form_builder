const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = 5001;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'divyansh',
  password: '12345678',
  database: 'form_builder'
});

// Connect to Database (mysql)
db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    return;
  }
  console.log('Connected to MySQL');
});

// Save a new form
app.post('/api/forms', (req, res) => {
  const { title, structure } = req.body;
  const sql = 'INSERT INTO forms (title, structure) VALUES (?, ?)';
  db.query(sql, [title, JSON.stringify(structure)], (err, result) => {
    if (err) {
      console.error('Error saving form:', err.message);
      return res.status(500).json({ error: 'Failed to save form' });
    }
    res.status(201).json({ formId: result.insertId });
  });
});

// Get latest form
app.get('/api/forms/latest', (req, res) => {
  const sql = 'SELECT * FROM forms ORDER BY created_at DESC LIMIT 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching latest form:', err.message);
      return res.status(500).json({ error: 'Failed to fetch latest form' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'No form found' });
    const form = results[0];
    if (typeof form.structure === 'string') {
      form.structure = JSON.parse(form.structure);
    }   
    res.json(form);
  });
});

// Submit form response
app.post('/api/forms/:formId/responses', (req, res) => {
  const formId = req.params.formId;
  const { responses } = req.body;

  const sql = 'INSERT INTO submissions (form_id, responses) VALUES (?, ?)';
  db.query(sql, [formId, JSON.stringify(responses)], (err) => {
    if (err) {
      console.error('Error submitting response:', err.message);
      return res.status(500).json({ error: 'Failed to submit response' });
    }
    res.status(200).json({ message: 'Response submitted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});