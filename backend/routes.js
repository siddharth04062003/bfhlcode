const express = require('express');
const router = express.Router();

router.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

router.post('/bfhl', (req, res) => {
    try {
        const data = req.body.data;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, error: "Invalid data format.  Expected an array." });
        }

        const numbers = data.filter(item => /^-?\d+$/.test(item));
        const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));

        const highest_alphabet = alphabets.length > 0 ? [alphabets.reduce((a, b) => a.toLowerCase() > b.toLowerCase() ? a : b)] : [];

        const response = {
            is_success: true,
            user_id: "Siddharth Gautam", // Replace with your information
            email: "22bcs16300@cuchd.in",  // Replace with your information
            roll_number: "22bcs16300", // Replace with your information
            numbers: numbers,
            alphabets: alphabets,
            highest_alphabet: highest_alphabet
        };

        res.json(response);

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ is_success: false, error: error.message });
    }
});

module.exports = router;
