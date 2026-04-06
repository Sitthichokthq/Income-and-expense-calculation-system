import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Use your existing firebaseConfig
const firebaseConfig = {
 //you api key
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const ctx = document.getElementById('summaryChart').getContext('2d');
let myChart;

// 1. Initialize Chart
function initChart(labels, revenueData, expenseData) {
    if (myChart) myChart.destroy(); // Destroy old chart before creating new one

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenueData,
                    backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'rgba(239, 68, 68, 0.6)', // Red
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// 2. Fetch and Process Data
const dbRef = ref(database, 'monny');
onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const monthlySummary = {};

    // Process Firebase object
    Object.values(data).forEach(entry => {
        const date = new Date(entry.date);
        // Create a key like "Jan 2024"
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });

        if (!monthlySummary[monthYear]) {
            monthlySummary[monthYear] = { rev: 0, exp: 0 };
        }

        monthlySummary[monthYear].rev += parseFloat(entry.revenue) || 0;
        monthlySummary[monthYear].exp += parseFloat(entry.expense) || 0;
    });

    // Sort months chronologically
    const sortedLabels = Object.keys(monthlySummary).sort((a, b) => new Date(a) - new Date(b));
    const revData = sortedLabels.map(label => monthlySummary[label].rev);
    const expData = sortedLabels.map(label => monthlySummary[label].exp);

    initChart(sortedLabels, revData, expData);
});
