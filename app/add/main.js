import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmKyGOfUzhjOJSOn1aSkajdYAGGIb5FZM",
  authDomain: "sitthichokthq.firebaseapp.com",
  databaseURL: "https://sitthichokthq-default-rtdb.firebaseio.com",
  projectId: "sitthichokthq",
  storageBucket: "sitthichokthq.firebasestorage.app",
  messagingSenderId: "600844750690",
  appId: "1:600844750690:web:241e0c7b015c897d5da63b",
  measurementId: "G-VYYPFH6X0Y"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 1. Helper function for handling the delay
const wait = (ms) => new Promise(res => setTimeout(res, ms));

const addForm = document.getElementById('add-form');
const bannerAlert = document.getElementById('banneralert'); // Ensure this ID exists in your HTML

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const useForInput = document.getElementById('userfor');
  const revenueInput = document.getElementById('revenue');
  const expenseInput = document.getElementById('expense');
  const dateInput = document.getElementById('date');

  if (!useForInput || !revenueInput || !expenseInput || !dateInput) return;

  const useFor = useForInput.value;
  const revenue = parseFloat(revenueInput.value) || 0;
  const expense = parseFloat(expenseInput.value) || 0;
  const date = dateInput.value;

  const monnyRef = ref(database, 'monny');
  const newEntryRef = push(monnyRef);

  try {
    // 2. Push data to Firebase
    await set(newEntryRef, {
      usefor: useFor, // Using 'usefor' to match the table logic
      revenue: revenue,
      expense: expense,
      date: date
    });

    // 3. Show Success Alert immediately
    if (bannerAlert) {
        bannerAlert.innerHTML = `
            <div role="alert" class="alert alert-success shadow-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Entry added successfully!</span>
            </div>`;
    }

    addForm.reset(); 
    
    // 4. Close Modal
    const modal = document.getElementById('my_modal_3');
    if (modal) modal.close();

    // 5. Hide alert after 3 seconds
    await wait(3000);
    if (bannerAlert) bannerAlert.innerHTML = '';

  } catch (error) {
    console.error('Error:', error);
    if (bannerAlert) {
        bannerAlert.innerHTML = `
            <div role="alert" class="alert alert-error shadow-lg">
                <span>Error saving data!</span>
            </div>`;
        await wait(3000);
        bannerAlert.innerHTML = '';
    }
  }
});