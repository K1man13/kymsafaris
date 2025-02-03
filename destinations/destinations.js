// import { Timestamp } from "firebase/firestore/lite";
let placeName = "";
let placeDescription = "";

document.addEventListener("DOMContentLoaded", () => {
  const bookButtons = document.querySelectorAll(".book-now");

  bookButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".card");
      const placeName = card.dataset.place;
      const placeDescription = card.dataset.description;

      openBookingPage(placeName, placeDescription);
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

          <button type="submit" class="intaSendPayButton">Confirm Booking</button>
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
    placeName: placeName,
    placeDescription: placeDescription,
    // time: Timestamp.now(),
  };

  // Proceed to IntaSend Payment
  triggerIntaSendPayment(bookingDetails);
}

function triggerIntaSendPayment(bookingDetails) {
  const paymentButton = document.querySelector(".intaSendPayButton");

  if (!paymentButton) {
    console.error("IntaSend payment button not found");
    return;
  }

  // Initialize IntaSend
  const intasend = new window.IntaSend({
    publicAPIKey: "ISPubKey_live_3f5c524e-4dd3-4a87-beb9-d28ba7172790",
    live: true, // set to true when going live
  });

  // Attach event listeners
  intasend.on("COMPLETE", (results) => {
    console.log("Payment successful", results);
    saveBookingToFirebase(bookingDetails);
    // Handle successful payment (e.g., save booking details to your database)
  });
  intasend.on("FAILED", (results) => {
    console.log("Payment failed", results);
    // Handle payment failure
  });
  intasend.on("IN-PROGRESS", (results) => {
    console.log("Payment in progress", results);
  });

  // Update the button attributes
  paymentButton.dataset.amount = calculateBookingAmount(bookingDetails); // Replace with actual amount based on bookingDetails
  paymentButton.dataset.currency = "KES";

  // Simulate button click
  paymentButton.click();
}

function calculateBookingAmount(bookingDetails) {
  const price_per_night = 2500; 
  const mealPrice = bookingDetails.meals === "yes" ? 500 : 0; 
  return (
    (price_per_night + mealPrice) *
    bookingDetails.visitors *
    bookingDetails.days
  );
}

function saveBookingToFirebase(bookingDetails) {
  const user = firebase.auth().currentUser;

  if (user) {
    const userId = user.uid; // User's Firebase UID
    const userEmail = user.email; // User's email

    const dbRef = ref(database, "bookings/" + userId + "/" + Date.now()); // Create a new unique path for each booking

    set(dbRef, {
      userId: userId,
      userEmail: userEmail,
      ...bookingDetails,
      timestamp: Timestamp.now(), // Add the current timestamp
    })
      .then(() => {
        console.log("Booking saved successfully");
      })
      .catch((error) => {
        console.error("Error saving booking: ", error);
      });
  } else {
    console.error("No user is signed in.");
  }
}