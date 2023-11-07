const mongoose = require('mongoose');

const MONGO_URI = process.env.DATABASE_URL;

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

module.exports = { db };