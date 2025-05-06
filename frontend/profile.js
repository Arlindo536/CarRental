document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !userInfo._id) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Set up tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const profileSections = document.querySelectorAll('.profile-section');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and sections
            tabButtons.forEach(btn => btn.classList.remove('active'));
            profileSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Load rentals if rental history tab is clicked
            if (tabId === 'rental-history') {
                loadRentals();
            }
        });
    });
    
    // Display user info
    document.getElementById('user-name').textContent = userInfo.name || 'N/A';
    document.getElementById('user-email').textContent = userInfo.email || 'N/A';
    
    // Format registration date
    const regDate = userInfo.createdAt ? new Date(userInfo.createdAt) : new Date();
    document.getElementById('user-date').textContent = regDate.toLocaleDateString('sq-AL');
    
    // Setup logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        console.log('Logout button clicked');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
    
    // Function to load rental history
    async function loadRentals() {
        const tableContainer = document.getElementById('rental-table-container');
        tableContainer.innerHTML = '<p class="loading-message">Duke ngarkuar rezervimet...</p>';
        
        try {
            const response = await fetch('/api/rentals/myrentals', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Gabim gjatë ngarkimit të rezervimeve');
            }
            
            const rentals = await response.json();
            
            if (rentals.length === 0) {
                tableContainer.innerHTML = '<p class="empty-message">Nuk keni ende rezervime.</p>';
                return;
            }
            
            // Create table with rentals
            let tableHTML = `
                <table class="rental-history-table">
                    <thead>
                        <tr>
                            <th>Makina</th>
                            <th>Data Fillimit</th>
                            <th>Data Mbarimit</th>
                            <th>Çmimi Total</th>
                            <th>Statusi</th>
                            <th>Pagesa</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            rentals.forEach(rental => {
                // Format dates
                const startDate = new Date(rental.startDate).toLocaleDateString('sq-AL');
                const endDate = new Date(rental.endDate).toLocaleDateString('sq-AL');
                
                // Determine status class
                const statusClass = `status-${rental.status}`;
                
                // Determine payment status
                const paymentStatus = rental.isPaid ? 'Paguar' : 'Jo e paguar';
                
                tableHTML += `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center;">
                                <img src="images/${rental.car.image}" alt="${rental.car.name}">
                                <span style="margin-left: 10px;">${rental.car.name}</span>
                            </div>
                        </td>
                        <td>${startDate}</td>
                        <td>${endDate}</td>
                        <td>${rental.totalPrice} €</td>
                        <td><span class="rental-status ${statusClass}">${rental.status}</span></td>
                        <td>${paymentStatus}</td>
                    </tr>
                `;
            });
            
            tableHTML += `
                    </tbody>
                </table>
            `;
            
            tableContainer.innerHTML = tableHTML;
            
        } catch (error) {
            tableContainer.innerHTML = `<p class="empty-message">Gabim: ${error.message}</p>`;
        }
    }
});