// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Config (Replace with your actual config)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAcesu8kpz6GP56eNn08d4qU5mCZd_XVok",
    authDomain: "kym-safaris.firebaseapp.com",
    databaseURL: "https://kym-safaris-default-rtdb.firebaseio.com",
    projectId: "kym-safaris",
    storageBucket: "kym-safaris.appspot.com",
    messagingSenderId: "543244339577",
    appId: "1:543244339577:web:d561de933d34e6e9f887a8",
    measurementId: "G-EP263TMFEX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elements
const loginForm = document.getElementById("main");
const signUpForm = document.getElementById("create-acct");

const emailLogin = document.getElementById("email");
const passwordLogin = document.getElementById("password");
const loginButton = document.getElementById("submit");

const emailSignUp = document.getElementById("email-signup");
const confirmEmailSignUp = document.getElementById("confirm-email-signup");
const passwordSignUp = document.getElementById("password-signup");
const confirmPasswordSignUp = document.getElementById("confirm-password-signup");
const createAccountButton = document.getElementById("create-acct-btn");
const returnButton = document.getElementById("return-btn");

// Switch to sign-up form
document.getElementById("sign-up").addEventListener("click", () => {
    loginForm.style.display = "none";
    signUpForm.style.display = "block";
});

// Switch back to login form
returnButton.addEventListener("click", () => {
    signUpForm.style.display = "none";
    loginForm.style.display = "block";
});

// Login function
loginButton.addEventListener("click", async () => {
    const email = emailLogin.value;
    const password = passwordLogin.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        window.location.href = "destinations/destinations.html"; // Redirect to a user dashboard or home page
    } catch (error) {
        alert(error.message);
    }
});

    // Sign-up function
createAccountButton.addEventListener("click", async () => {
    const email = emailSignUp.value;
    const confirmEmail = confirmEmailSignUp.value;
    const password = passwordSignUp.value;
    const confirmPassword = confirmPasswordSignUp.value;

    if (email !== confirmEmail) {
        alert("Emails do not match!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
        signUpForm.style.display = "none";
        loginForm.style.display = "block";
    } catch (error) {
        alert(error.message);
    }
});
