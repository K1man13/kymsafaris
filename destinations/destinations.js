let globalPlaceName = "";
let globalPlaceDescription = "";

document.addEventListener("DOMContentLoaded", () => {
    const bookButtons = document.querySelectorAll(".book-now");

    bookButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const card = event.target.closest(".card");
            globalPlaceName = card.dataset.place;
            globalPlaceDescription = card.dataset.description;

            openBookingPage(globalPlaceName, globalPlaceDescription);
        });
    });
});

function openBookingPage(placeName, placeDescription) {
    const bookingPage = document.createElement("div");
    bookingPage.classList.add("booking-page");
    bookingPage.innerHTML = `
        <h2>Book Your Stay at ${placeName}</h2>
        <p>${placeDescription}</p>
        <form class="booking-form">
            <label for="visitors">Number of Visitors:</label>
            <input type="number" id="visitors" name="visitors" min="1" required>
            <label for="days">Number of Stay Days:</label>
            <input type="number" id="days" name="days" min="1" required>
            <label for="meals">Full Board Meals:</label>
            <select id="meals" name="meals" required>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <label for="additional">Additional Requests:</label>
            <textarea id="additional" name="additional"></textarea>
            <button type="submit" class="pesapalPayButton">Confirm Booking</button>
        </form>
        <button class="btn back-btn">Back</button>
    `;

    document.body.innerHTML = "";
    document.body.appendChild(bookingPage);

    document.querySelector(".back-btn").addEventListener("click", () => {
        location.reload(); // Reload the page to go back to the main list
    });

    document
        .querySelector(".booking-form")
        .addEventListener("submit", handleBookingFormSubmit);
}

function handleBookingFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const bookingDetails = {
        visitors: formData.get("visitors"),
        days: formData.get("days"),
        meals: formData.get("meals"),
        additional: formData.get("additional"),
        placeName: globalPlaceName,
        placeDescription: globalPlaceDescription,
    };

    // Proceed to Pesapal Payment
    triggerPesapalPayment(bookingDetails);
}

function triggerPesapalPayment(bookingDetails) {
    const paymentButton = document.querySelector(".pesapalPayButton");

    if (!paymentButton) {
        console.error("Pesapal payment button not found");
        return;
    }

    // Calculate the amount based on booking details
    const amount = calculateBookingAmount(bookingDetails);

    // Initialize Pesapal Payment
    const paymentData = {
        amount: amount,
        currency: "KES", // You can change this if needed
        description: `Booking for ${globalPlaceName}`,
        email: "user@example.com", // Replace with the user's email if available
        phoneNumber: "0722002000", // Replace with the user's phone number if available
        referenceNumber: "ref123456", // This should be a unique reference ID for the transaction
        callbackUrl: "https://yourwebsite.com/payment-callback", // Pesapal will send the payment response here
    };

    // Submit the payment request to Pesapal (this is usually done on the server side, but for demonstration purposes, we are directly sending the request)
    makePesapalPaymentRequest(paymentData);
}

function makePesapalPaymentRequest(paymentData) {
    // The Pesapal API request to initiate payment (this should ideally be done from the server side)
    // Example: You will need your Pesapal Consumer Key and Consumer Secret here
    const pesapalConsumerKey = "vI4EkkrEk+4zh1CptdGwp5kZeVnPoTTh";
    const pesapalConsumerSecret = "gVmuftPZNDRxFpIppfk/F4+qBD8=";
    const pesapalPaymentUrl = "https://store.pesapal.com/kymsafaris";

    // Create the payment request
    const paymentRequest = {
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        email: paymentData.email,
        phoneNumber: paymentData.phoneNumber,
        referenceNumber: paymentData.referenceNumber,
        callbackUrl: paymentData.callbackUrl,
    };

    // Use a method to send this request to your server (using Fetch API, Axios, etc.) and handle the response.
    fetch(pesapalPaymentUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(pesapalConsumerKey + ":" + pesapalConsumerSecret)}`
        },
        body: JSON.stringify(paymentRequest),
    })
    .then(response => response.json())
    .then(data => {
        // Redirect to the Pesapal payment page
        if (data.paymentUrl) {
            window.location.href = data.paymentUrl; // Redirect to Pesapal for payment
        }
    })
    .catch(error => {
        console.error("Error initiating Pesapal payment:", error);
    });
}

function calculateBookingAmount(bookingDetails) {
    const basePrice = 2000; // Example base price per person per day
    const mealPrice = bookingDetails.meals === "yes" ? 500 : 0; // Example meal cost
    return (basePrice + mealPrice) * bookingDetails.visitors * bookingDetails.days;
}

function saveBookingToFirebase(bookingDetails) {
    const user = firebase.auth().currentUser;

    if (user) {
        const userId = user.uid;
        const userEmail = user.email;

        const dbRef = firebase.database().ref("bookings/" + userId);
        dbRef.set({
            userEmail,
            userId,
            ...bookingDetails,
            timeStamp: firebase.firestore.Timestamp.now(),
        })
        .then(() => {
            console.log("Booking saved successfully");
            alert("Your booking has been saved successfully.");
        })
        .catch((error) => {
            console.error("Error saving booking:", error);
            alert("Error saving booking.");
        });
    } else {
        console.error("User not authenticated");
        alert("You must be logged in to complete the booking.");
    }
}
