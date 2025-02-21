const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing JSON bodies

// const uri = process.env.ATLAS_URI;  // MongoDB connection string
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }
// );
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// });

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
