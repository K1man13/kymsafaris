// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  };
  
  // Initialize Firebase App and Firestore
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Extract the search query from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  
  // Update page title and display the query
  document.title = `Search Results for "${query}"`;
  
  if (query) {
    // Perform search query to Firebase Firestore
    searchDestinations(query);
  } else {
    document.getElementById('results-container').innerHTML = 'No search query provided.';
  }
  
  // Function to search destinations in Firestore
  function searchDestinations(query) {
    db.collection('destinations')
      .where('name', '>=', query)
      .where('name', '<=', query + '\uf8ff')
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          document.getElementById('results-container').innerHTML = 'No destinations found.';
        } else {
          let resultsHTML = '';
          snapshot.forEach(doc => {
            const destination = doc.data();
            resultsHTML += `
              <div class="card">
                <img src="${destination.imageUrl}" alt="${destination.name}" />
                <div class="card-content">
                  <h2>${destination.name}</h2>
                  <p>${destination.description}</p>
                  <p class="price">$${destination.price}</p>
                  <button onclick="bookNow('${destination.name}')">Book Now</button>
                </div>
              </div>
            `;
          });
          document.getElementById('results-container').innerHTML = resultsHTML;
        }
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        document.getElementById('results-container').innerHTML = 'Error fetching results.';
      });
  }
  
  // Function for booking (just for demonstration)
  function bookNow(destinationName) {
    alert(`Booking for ${destinationName} is not yet implemented.`);
  }
  