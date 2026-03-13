import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCty4d92WTJv9YsmFxaAn5AFKGaof5CL8I",
    authDomain: "sankalp-ff-tournament.firebaseapp.com",
    projectId: "sankalp-ff-tournament",
    storageBucket: "sankalp-ff-tournament.firebasestorage.app",
    messagingSenderId: "555712022728",
    appId: "1:555712022728:web:bdc8f13378801587383dfd",
    measurementId: "G-CSTMZ23T5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// State variables
let currentEvent = '';
let currentFee = 0;

// DOM Elements
const modalOverlay = document.getElementById('modalOverlay');
const regModal = document.getElementById('registrationModal');
const paymentModal = document.getElementById('paymentModal');
const successModal = document.getElementById('successModal');

const selectedEventNameEl = document.getElementById('selectedEventName');
const displayAmountEl = document.getElementById('displayAmount');
const paymentAmountEl = document.getElementById('paymentAmount');

const regForm = document.getElementById('registrationForm');
const paymentForm = document.getElementById('paymentForm');

// File Upload Custom Text
const fileInput = document.getElementById('paymentScreenshot');
const fileCustom = document.querySelector('.file-custom');

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        fileCustom.textContent = e.target.files[0].name;
        fileCustom.style.background = 'rgba(0,243,255,0.1)';
        fileCustom.style.color = '#fff';
    } else {
        fileCustom.textContent = 'Choose file...';
        fileCustom.style.background = 'rgba(0,0,0,0.5)';
        fileCustom.style.color = 'var(--text-muted)';
    }
});

// Functions
function openRegistration(eventName, feeAmount) {
    currentEvent = eventName;
    currentFee = feeAmount;

    // Update UI
    selectedEventNameEl.textContent = eventName;
    displayAmountEl.textContent = feeAmount;
    paymentAmountEl.textContent = feeAmount;

    // Reset Form
    regForm.reset();

    // Show Modal
    modalOverlay.classList.remove('hidden');
    regModal.classList.remove('hidden');
    paymentModal.classList.add('hidden');
    successModal.classList.add('hidden');
}

function handleRegistrationSubmit(e) {
    e.preventDefault();

    // Simple validation could go here if needed 
    // HTML5 validation covers required fields already

    // Hide Reg Modal, Show Payment Modal
    regModal.classList.add('hidden');
    paymentModal.classList.remove('hidden');
}
window.handleRegistrationSubmit = handleRegistrationSubmit;

async function saveRegistration(registrationData) {
    try {
        const docRef = await addDoc(collection(db, "registrations"), registrationData);
        console.log("Document written with ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}

async function handlePaymentSubmit(e) {
    e.preventDefault();

    const submitBtn = paymentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // Gather form data
    const registrationData = {
        team: document.getElementById('teamName').value,
        captain: document.getElementById('captainName').value,
        phone: document.getElementById('phoneNumber').value,
        player1: document.getElementById('p1Id').value,
        player2: document.getElementById('p2Id').value,
        player3: document.getElementById('p3Id').value,
        player4: document.getElementById('p4Id').value,
        event: currentEvent,
        amount: currentFee,
        registrationTime: serverTimestamp()
    };

    // Save to Firestore
    const success = await saveRegistration(registrationData);

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    if (success) {
        // Hide Payment Modal, Show Success Modal
        paymentModal.classList.add('hidden');
        successModal.classList.remove('hidden');
    } else {
        alert("There was an error saving your registration. Please try again.");
    }
}
window.handlePaymentSubmit = handlePaymentSubmit;

function closeModals() {
    modalOverlay.classList.add('hidden');
    regModal.classList.add('hidden');
    paymentModal.classList.add('hidden');
    successModal.classList.add('hidden');

    // Reset state
    currentEvent = '';
    currentFee = 0;
    regForm.reset();
    paymentForm.reset();
    fileCustom.textContent = 'Choose file...';
    fileCustom.style.background = 'rgba(0,0,0,0.5)';
    fileCustom.style.color = 'var(--text-muted)';
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModals();
    }
});

window.openRegistration = openRegistration;
window.closeModals = closeModals;
