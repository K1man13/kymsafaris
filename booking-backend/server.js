const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

// Use body parser to handle JSON data in POST requests
app.use(bodyParser.json());

// Pesapal API credentials (replace with your actual credentials)
const pesapalConsumerKey = "YOUR_CONSUMER_KEY";
const pesapalConsumerSecret = "YOUR_CONSUMER_SECRET";
const pesapalPaymentUrl = "https://www.pesapal.com/API/PostPesapalDirectOrderV4";

// Route to create Pesapal payment order
app.post("/create-pesapal-payment", async (req, res) => {
    const paymentData = req.body;

    const paymentRequest = {
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        email: paymentData.email,
        phoneNumber: paymentData.phoneNumber,
        referenceNumber: paymentData.referenceNumber,
        callbackUrl: paymentData.callbackUrl,
    };

    try {
        // Make the API request to Pesapal to create a payment order
        const response = await axios.post(pesapalPaymentUrl, paymentRequest, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(pesapalConsumerKey + ":" + pesapalConsumerSecret).toString("base64")}`,
            },
        });

        // If successful, return the Pesapal payment URL to the frontend
        if (response.data && response.data.paymentUrl) {
            res.json({ paymentUrl: response.data.paymentUrl });
        } else {
            res.status(500).json({ error: "Error creating Pesapal payment session." });
        }
    } catch (error) {
        console.error("Error initiating Pesapal payment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to handle the payment callback from Pesapal
app.get("/payment-callback", (req, res) => {
    const paymentStatus = req.query.status; // e.g., 'success' or 'failed'
    const referenceNumber = req.query.referenceNumber;
    const transactionId = req.query.transactionId;

    // You can store this info in a database to confirm payment status
    console.log(`Payment status: ${paymentStatus}`);
    console.log(`Reference Number: ${referenceNumber}`);
    console.log(`Transaction ID: ${transactionId}`);

    if (paymentStatus === "success") {
        res.send("Payment was successful! Thank you for booking.");
    } else {
        res.send("Payment failed. Please try again.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
