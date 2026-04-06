// Grab all the dock buttons and the view sections
const dockButtons = document.querySelectorAll('.dock button');
const views = {
    'home': document.getElementById('view-home'),
    'stacked_line_chart': document.getElementById('view-data'), // 'Data' button icon name
    'settings': document.getElementById('view-settings')
};

dockButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. Remove 'dock-active' class from all buttons
        dockButtons.forEach(btn => btn.classList.remove('dock-active'));
        
        // 2. Add 'dock-active' to the clicked button
        button.classList.add('dock-active');

        // 3. Hide all view sections
        Object.values(views).forEach(view => {
            if (view) {
                view.classList.remove('block');
                view.classList.add('hidden');
            }
        });

        // 4. Show the section that matches the clicked button's icon text
        const iconName = button.querySelector('.material-symbols-outlined').textContent.trim();
        if (views[iconName]) {
            views[iconName].classList.remove('hidden');
            views[iconName].classList.add('block');
        }
    });
});