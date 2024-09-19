// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection, getDocs, query, where, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";


const firebaseConfig = {
  // firebase config here
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

window.addStudent = () => {
  window.location.href = "../add-student/addStudent.html";
};

window.uploadMarks = () => {
  window.location.href = "../upload-marks/marks.html";
};

// Function to fetch and display students with userType 'Student'
async function displayStudents() {
  const studentsTableBody = document.getElementById('studentsTableBody');

  try {
    // Query to fetch students from Firestore with userType 'Student'
    const studentsQuery = query(collection(db, "users"), where("userType", "==", "Student"));
    const querySnapshot = await getDocs(studentsQuery);

    // Loop through each student document
    querySnapshot.forEach((doc) => {
      const student = doc.data();
      const studentId = doc.id; // Get the document ID for deletion

      // Create a table row for each student
      const row = document.createElement('tr');

      row.innerHTML = `
        <td class="py-2 px-4 border-b border-gray-200">${student.firstName}</td>
        <td class="py-2 px-4 border-b border-gray-200">${student.lastName}</td>
        <td class="py-2 px-4 border-b border-gray-200">${student.email}</td>
        <td class="py-2 px-4 border-b border-gray-200">${student.cnic}</td>
        <td class="py-2 px-4 border-b border-gray-200">
          <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${studentId}">
            Delete
          </button>
        </td>
      `;

      // Append the row to the table body
      studentsTableBody.appendChild(row);
    });

    // Attach event listeners to all delete buttons
    attachDeleteListeners();
  } catch (error) {
    console.error("Error fetching students: ", error.message);
  }
}

// Function to attach event listeners to delete buttons
function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const studentId = e.target.getAttribute('data-id');
      try {
        await deleteStudent(studentId);
        // Remove the student row from the table
        e.target.parentElement.parentElement.remove();
        alert("Student deleted successfully.");
      } catch (error) {
        console.error("Error deleting student: ", error.message);
      }
    });
  });
}

// Function to delete a student from Firestore
async function deleteStudent(studentId) {
  try {
    await deleteDoc(doc(db, "users", studentId));
    console.log("Student successfully deleted!");
  } catch (error) {
    console.error("Error removing document: ", error);
  }
}

// Call the displayStudents function when the page loads
window.onload = displayStudents;
