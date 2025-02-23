const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing JSON bodies

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
