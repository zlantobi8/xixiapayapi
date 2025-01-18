const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON request body
app.use(bodyParser.json());
require('dotenv').config();

// Replace with your actual values
const apiSecret = process.env.SECRETKEY;
const apiKey = process.env.APIKEY;
const businessId = process.env.BUSINESSID; // This comes from the developer page

// POST route to create a virtual account
app.post('/createVirtualAccount', async (req, res) => {
  const { customerEmail, customerName, customerPhoneNumber } = req.body;

  if (!customerEmail || !customerName || !customerPhoneNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const headers = {
    'Authorization': `Bearer ${apiSecret}`,
    'Content-Type': 'application/json',
    'api-key': apiKey,
  };

  const data = {
    email: customerEmail,
    name: customerName,
    phoneNumber: customerPhoneNumber,
    bankCode: ["20867"], // Bank codes for Palmpay and WEMA
    businessId: businessId,
  };

  const url = 'https://api.xixapay.com/api/v1/createVirtualAccount';

  try {
    const response = await axios.post(url, data, { headers });
    const { status, message, customer, bankAccounts } = response.data;

    res.json({
      status,
      message,
      customer,
      bankAccounts,
    });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Error creating virtual account',
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
