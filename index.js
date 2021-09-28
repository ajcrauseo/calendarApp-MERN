const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { dbConnection } = require('./db/config');

const { PORT } = process.env;

// Express Server
const app = express();

// DB
dbConnection();

// CORS
app.use(cors());

// Public Directory
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.listen(PORT, () => console.log(`Lintening at port ${PORT}`));
