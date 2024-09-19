// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // firebase config here
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

let email = document.getElementById("email");
let password = document.getElementById("password");

window.loginUser = async () => {
  try {
    const emailValue = email.value;
    const passwordValue = password.value;

    // Validate email and password fields
    if (!emailValue || !passwordValue) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter both email and password.',
      });
      return;
    }

    // Sign in the user with email and password
    const { user } = await signInWithEmailAndPassword(auth, emailValue, passwordValue);
    const userId = user.uid;
    
    // Fetch student data from Firestore
    const studentRef = doc(db, "users", userId);
    const studentSnap = await getDoc(studentRef);
    

    if (studentSnap.exists()) {
      // Store student data in localStorage
      const studentData = studentSnap.data();
      localStorage.setItem("student", JSON.stringify(studentData));

      // Display success message
      Swal.fire({
        icon: 'success',
        title: 'Logged In!',
        text: 'You have successfully logged in!',
      });

      // Redirect after a delay
      setTimeout(() => {
        window.location.replace("../../../index.html");
      }, 2000);
    } else {
      // Handle case where student data is not found
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Student data not found!',
      });
    }
  } catch (error) {
    // Handle login errors
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error.message.includes("user-not-found") || error.message.includes("wrong-password")
        ? 'Invalid email or password.'
        : 'An unexpected error occurred. Please try again later.',
    });
  }
};
