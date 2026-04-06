const navbar = document.querySelector('#navbar');

// 1. Added IDs (searchInput, monthSelect, yearSelect) to the inputs
navbar.innerHTML=`
<div class="navbar bg-base-100 shadow-sm">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">Income and expenses</a>
  </div>
  <div class="flex gap-4">
   <div class="join">
  <div>
    <div>
      <input id="searchInput" class="input join-item w-48" placeholder="Search" />
    </div>
  </div>
  <select id="monthSelect" class="select join-item">
    <option disabled selected>Month</option>
    <option>January</option>
    <option>February</option>
    <option>March</option>
    <option>April</option>
    <option>May</option>
    <option>June</option>
    <option>July</option>
    <option>August</option>
    <option>September</option>
    <option>October</option>
    <option>November</option>
    <option>December</option>
  </select>
  <select id="yearSelect" class="select join-item">
    <option disabled selected>Year</option>
    <option>2024</option>
    <option>2025</option>
    <option>2026</option>
    <option>2027</option>
    <option>2028</option>
    <option>2029</option>
    <option>2030</option>
  </select>
</div>
    
    <button class="btn bg-primary text-primary-content" onclick="my_modal_3.showModal()"><span class="material-symbols-outlined">add</span></button>
  </div>
</div>
`;

// 2. Get references to the newly created elements
const searchInput = document.getElementById('searchInput');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');

// 3. Add Event Listeners to trigger the filter when values change
searchInput.addEventListener('input', filterTable); // 'input' fires as you type
monthSelect.addEventListener('change', filterTable);
yearSelect.addEventListener('change', filterTable);

// 4. The Filtering Logic
function filterTable() {
    const searchText = searchInput.value.toLowerCase();
    const selectedMonth = monthSelect.value;
    const selectedYear = yearSelect.value;

    // UPDATE THIS: Change 'expenseTable' to the actual ID of your table
    const tableRows = document.querySelectorAll('#expenseTable tbody tr');

    tableRows.forEach(row => {
        // UPDATE THESE: Change the cell indexes (0, 1, 2) to match your table columns
        // e.g., row.cells[0] is the 1st column, row.cells[1] is the 2nd column
        const dateCellText = row.cells[0].textContent.toLowerCase(); // Assuming Date is Col 1
        const descriptionText = row.cells[1].textContent.toLowerCase(); // Assuming Desc is Col 2
        const rowText = row.textContent.toLowerCase(); // Grabs all text in the row for broad searching

        // Check if the row matches the Search Input
        const matchesSearch = searchText === "" || rowText.includes(searchText);

        // Check if the row matches the Month Select
        // (If default "Month" is selected, ignore this filter)
        const matchesMonth = selectedMonth === "Month" || dateCellText.includes(selectedMonth.toLowerCase());

        // Check if the row matches the Year Select
        // (If default "Year" is selected, ignore this filter)
        const matchesYear = selectedYear === "Year" || dateCellText.includes(selectedYear);

        // If ALL conditions are met, show the row. Otherwise, hide it.
        if (matchesSearch && matchesMonth && matchesYear) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}