// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection, where, doc, getDocs, query, updateDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";


const firebaseConfig = {
//   firebase config here
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

// Fetch logged-in student data from local storage
const user = JSON.parse(localStorage.getItem('student'));
const studentInfoContainer = document.getElementById('studentInfo');
const studentMarksTableBody = document.getElementById('studentMarksTableBody');
const editProfileModal = document.getElementById('editProfileModal');
const editProfileForm = document.getElementById('editProfileForm');
const editFirstName = document.getElementById('editFirstName');
const editLastName = document.getElementById('editLastName');
const editCnic = document.getElementById('editCnic');

// Function to get and render student data
async function getStudentData(userId) {
    try {
        const studentDocRef = doc(db, 'users', userId);
        const studentSnapshot = await getDoc(studentDocRef);

        if (studentSnapshot.exists()) {
            const studentData = studentSnapshot.data();
            renderStudentInfo(studentData);
            populateEditProfileForm(studentData);
        } else {
            console.error('No such student document!');
        }
    } catch (error) {
        console.error('Error getting student data:', error);
    }
}

// Function to render student information
function renderStudentInfo(studentData) {
    studentInfoContainer.innerHTML = `
        <p><strong>First Name:</strong> ${studentData.firstName}</p>
        <p><strong>Last Name:</strong> ${studentData.lastName}</p>
        <p><strong>Email:</strong> ${studentData.email}</p>
        <p><strong>CNIC:</strong> ${studentData.cnic}</p>
    `;
}

// Populate the edit form with student data
function populateEditProfileForm(studentData) {
    editFirstName.value = studentData.firstName;
    editLastName.value = studentData.lastName;
    editCnic.value = studentData.cnic;
}

// Function to open edit modal
document.getElementById('editProfileBtn').addEventListener('click', () => {
    editProfileModal.classList.remove('hidden');
});

// Function to close edit modal
document.getElementById('cancelEditBtn').addEventListener('click', (e) => {
    e.preventDefault();
    editProfileModal.classList.add('hidden');
});

// Function to handle profile edit submission
editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedData = {
        firstName: editFirstName.value,
        lastName: editLastName.value,
        cnic: editCnic.value,
    };

    try {
        const userId = user.userId;
        const studentDocRef = doc(db, 'users', userId);

        await updateDoc(studentDocRef, updatedData);

        Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile has been updated successfully!',
        });

        editProfileModal.classList.add('hidden');
        getStudentData(userId); // Refresh the student data after update
    } catch (error) {
        console.error('Error updating profile:', error);
    }
});

// Function to get and render student marks
async function getStudentMarks() {
    try {
        const userId = user.userId;
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

// Function to render student marks in the table
function renderStudentMarks(markData) {
    const row = `
        <tr>
            <td class="py-2 px-4 border-b border-gray-200">${markData.course}</td>
            <td class="py-2 px-4 border-b border-gray-200">${markData.marks}</td>
            <td class="py-2 px-4 border-b border-gray-200">${markData.totalMarks}</td>
            <td class="py-2 px-4 border-b border-gray-200">${markData.grade}</td>
        </tr>
    `;
    studentMarksTableBody.innerHTML += row;
}

// Fetch and display student info and marks on page load
getStudentData(user.userId);




// Handle result search by CNIC
document.getElementById('searchResultBtn').addEventListener('click', async () => {
    const cnic = document.getElementById('searchCnic').value;

    try {
        const q = query(collection(db, 'users'), where('cnic', '==', cnic));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert('No results found for this CNIC');
            return;
        }

        // Assuming one result per CNIC, fetch the student's marks
        querySnapshot.forEach(async (docSnapshot) => {
            const studentId = docSnapshot.id;
            const marksRef = collection(db, 'users', studentId, 'marks');
            const marksSnapshot = await getDocs(marksRef);

            studentMarksTableBody.innerHTML = ''; // Clear the table before showing results
            marksSnapshot.forEach((markDoc) => {
                renderStudentMarks(markDoc.data());
            });
        });
    } catch (error) {
        console.error('Error fetching results:', error);
    }
});