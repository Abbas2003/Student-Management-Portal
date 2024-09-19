// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
//  Firebase config here
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();



function init() {
  // Retrieve user object from localStorage
  let userObj = localStorage.getItem('student');
  userObj = JSON.parse(userObj);

  // Check if the user is logged in
  if (userObj) {
    // Hide login and signup links for both desktop and mobile
    document.getElementById('loginLink').style.display = "none";
    document.getElementById('loginLinkMobile').style.display = "none";
    document.getElementById('signupLink').style.display = "none";
    document.getElementById('signupLinkMobile').style.display = "none";

    // Show logout buttons for both desktop and mobile
    document.getElementById('logoutBtn').classList.remove('hidden');
    document.getElementById('logoutBtnMobile').classList.remove('hidden');

    // Determine user type and show appropriate portal links
    if (userObj.userType === "admin") {
      // Show admin portal link and hide student portal link
      document.getElementById('uploadLink').classList.remove('hidden');
      document.getElementById('uploadLinkMobile').classList.remove('hidden');
      document.getElementById('studentPortalLink').classList.add('hidden');
      document.getElementById('studentPortalLinkMobile').classList.add('hidden');
    } else if (userObj.userType === "Student") {
      // Show student portal link and hide admin portal link
      document.getElementById('studentPortalLink').classList.remove('hidden');
      document.getElementById('studentPortalLinkMobile').classList.remove('hidden');
      document.getElementById('uploadLink').classList.add('hidden');
      document.getElementById('uploadLinkMobile').classList.add('hidden');
    }
  } else {
    // If no user is logged in, make sure logout button and portal links are hidden
    document.getElementById('logoutBtn').classList.add('hidden');
    document.getElementById('logoutBtnMobile').classList.add('hidden');
    document.getElementById('uploadLink').classList.add('hidden');
    document.getElementById('uploadLinkMobile').classList.add('hidden');
    document.getElementById('studentPortalLink').classList.add('hidden');
    document.getElementById('studentPortalLinkMobile').classList.add('hidden');
  }
}

init();

window.logout = () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("student"); 
      location.reload();
    })
    .catch((err) => {
      alert(err.message);
    });
};

// JavaScript to handle mobile menu toggle
document.getElementById('menu-button').addEventListener('click', function () {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('hidden');
});
