import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

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

// Helper for your notification delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const tableContainer = document.querySelector('#table');
tableContainer.innerHTML = `
<div class="overflow-x-auto">
  <table id="expenseTable" class="table table-zebra w-full">
    <thead>
      <tr>
        <th>#</th>
        <th>Use For</th>
        <th>Revenue</th>
        <th>Expense</th>
        <th>Balance</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="table-body"></tbody>
  </table>
</div>
`;

const tbody = document.getElementById('table-body');
const bannerAlert = document.getElementById('banneralert');

// --- START FILTER LOGIC ---
function runFilters() {
    const searchVal = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const monthVal = document.getElementById('monthSelect')?.value || "Month";
    const yearVal = document.getElementById('yearSelect')?.value || "Year";

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const dateText = row.cells[5]?.innerText || ""; // Date column
        
        // Convert "2024-05-12" to "May" to match dropdown
        const dateObj = new Date(dateText);
        const rowMonth = dateObj.toLocaleString('en-US', { month: 'long' });
        const rowYear = dateObj.getFullYear().toString();

        const matchesSearch = text.includes(searchVal);
        const matchesMonth = monthVal === "Month" || rowMonth === monthVal;
        const matchesYear = yearVal === "Year" || rowYear === yearVal;

        row.style.display = (matchesSearch && matchesMonth && matchesYear) ? "" : "none";
    });
}

// Listen for navbar changes (Search/Month/Year)
document.addEventListener('input', (e) => {
    if (e.target.id === 'searchInput' || e.target.id === 'monthSelect' || e.target.id === 'yearSelect') {
        runFilters();
    }
});
// --- END FILTER LOGIC ---

const dbRef = ref(database, 'monny'); 

onValue(dbRef, (snapshot) => {
  tbody.innerHTML = ''; 
  const data = snapshot.val();
  
  if (data) {
    const sortedKeys = Object.keys(data).sort((a, b) => new Date(data[a].date) - new Date(data[b].date));
    
    let runningBalance = 0;
    let count = 1;
    
    sortedKeys.forEach((key) => {
      const entry = data[key];
      const rev = parseFloat(entry.revenue) || 0;
      const exp = parseFloat(entry.expense) || 0;
      runningBalance += (rev - exp);
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <th>${count}</th>
        <td>${entry.usefor || entry.use || '-'}</td>
        <td class="text-green-500">+${rev}</td>
        <td class="text-error">-${exp}</td>
        <td class="font-bold">${runningBalance.toFixed(2)}</td>
        <td>${entry.date || '-'}</td>
        <td><button class="btn btn-soft btn-secondary btn-sm  delete-btn" data-id="${key}">Delete</button></td>
      `;
      
      tbody.appendChild(tr);
      count++;
    });

    // Re-apply filters after data loads
    runFilters();

    // Delete Event Listeners
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.onclick = (e) => {
        const entryId = e.target.getAttribute('data-id');
        deleteEntry(entryId);
      };
    });

  } else {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">No data found</td></tr>`;
  }
});

async function deleteEntry(entryId) {
  if (!confirm(`Delete this entry?`)) return;

  const entryRef = ref(database, `monny/${entryId}`);
  
  try {
    await remove(entryRef);
    if (bannerAlert) {
        bannerAlert.innerHTML = `
            <div role="alert" class="alert alert-success">
                <span>Entry deleted successfully!</span>
            </div>`;
        await delay(3000);
        bannerAlert.innerHTML = '';
    }
  } catch (error) {
    console.error("Error:", error);
  }
}