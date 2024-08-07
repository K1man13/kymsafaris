const funtions = require ("fiebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

admin.intializeapp();
const db = admin.firestore();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});

// function to send emails to users after booking for a stay

exports.sendEmailToUsersLogin = functions.firestore
.document("usersBooking/{docId}")
.onCreate(async(snapshot) => {
    const tourData = snapshot.data()
    const userEmail = tourData.Email();
    const mailoptions = {
        from: process.env.USER_EMAIL,
        to: userEmail,
        subject: "Your booking has been confirmed!",
        text: `Thank you for booking with us. Your booking details are as follows`,
    };

    try {
        await transporter.sendMail(mailoptions);
    }catch (error) {
        console.log("Error sending email", error);
    }
        
});