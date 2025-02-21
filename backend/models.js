// Example model (if needed)
const mongoose = require('mongoose');

const bfhlSchema = new mongoose.Schema({
    data: { type: Array, required: true },
    userId: { type: String, required: true }
}, {
    timestamps: true,
});

const Bfhl = mongoose.model('Bfhl', bfhlSchema);

module.exports = Bfhl;
