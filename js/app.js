// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection, getDocs, query, where, getDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";


const firebaseConfig = {
  // Your firebase config here
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


window.searchResult = async () => {
  const searchInput = document.getElementById('user-cnic').value;
  
  if (!searchInput) {
    console.log("Please enter a valid CNIC.");
    return;
  }
  
  let ref = collection(db, "users");
  const q = query(ref, where("cnic", "==", searchInput));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const student = doc.data();
        const id = student.userId
        console.log("User found:", student);
        const studentInfo = document.getElementById("studentInfo");
        studentInfo.innerHTML = `<h2 class="text-2xl font-bold my-3 text-center">${student.firstName}</h2>`
        
        getStudentMarks(id)
      });
    } else {
      console.log("No user found with the provided CNIC.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

async function getStudentMarks(userId) {
  try {
      const marksCollectionRef = collection(db, 'users', userId, 'marks');
      const marksSnapshot = await getDocs(marksCollectionRef);      

      if (marksSnapshot.empty) {
          console.error('No marks found for this student.');
          return;
      }

      marksSnapshot.forEach((doc) => {
          const markData = doc.data();
          renderStudentMarks(markData);
      });
  } catch (error) {
      console.error('Error retrieving student marks:', error);
  }
}


function renderStudentMarks(markData) {
  const table = document.getElementById('studentMarksTableBody')
  const row = `
      <tr>
          <td class="py-2 px-4 border-b border-gray-200">${markData.course}</td>
          <td class="py-2 px-4 border-b border-gray-200">${markData.marks}</td>
          <td class="py-2 px-4 border-b border-gray-200">${markData.totalMarks}</td>
          <td class="py-2 px-4 border-b border-gray-200">${markData.grade}</td>
      </tr>
  `;
  table.innerHTML += row;
}