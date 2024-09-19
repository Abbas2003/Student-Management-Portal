import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";


const firebaseConfig = {
    // Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

// Add student form submission
const form = document.getElementById('addStudentForm');
const submitButton = document.getElementById('submitButton'); // Assuming your submit button has this ID

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cnic = document.getElementById('cnic').value;

    // Show loading state
    setLoadingState(true);

    // Create student in Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Get the user ID
            const userId = userCredential.user.uid;

            // Create an object with the student data
            const studentData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                cnic: cnic,
                userType: 'Student',
                userId: userId // Store user ID for reference
            };

            // Use setDoc with a specific userId as the document ID
            return setDoc(doc(db, 'users', userId), studentData);
        })
        .then(() => {
            alert("Student added successfully!");
            form.reset();
        })
        .catch((error) => {
            console.error("Error adding student: ", error.message);
            alert("Error adding student: " + error.message);
        })
        .finally(() => {
            // Hide loading state
            setLoadingState(false);
        });
});

// Function to handle loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        // Change button text to "Loading..." and disable it
        submitButton.innerHTML = "Loading...";
        submitButton.disabled = true;
        setTimeout(() => {
            submitButton.innerHTML = "Submit";
            submitButton.disabled = false;
            window.location.href = "../admin-pannel/admin.html";
        }, 3000); 
    } else {
        // Revert button text to "Submit" and enable it
        submitButton.innerHTML = "Submit";
        submitButton.disabled = false;
    }
}
