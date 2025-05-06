document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !userInfo._id) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Check if we should open a specific tab (from URL params)
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
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
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
    
    // If URL includes a tab parameter, open that tab
    if (tabParam && document.getElementById(tabParam)) {
        const tabToOpen = document.querySelector(`.tab-btn[data-tab="${tabParam}"]`);
        if (tabToOpen) {
            tabToOpen.click();
        }
    } else {
        // Otherwise, load rentals if we're on the rental history tab by default
        if (document.querySelector('.tab-btn.active').getAttribute('data-tab') === 'rental-history') {
            loadRentals();
        }
    }
});

// Function to load rental history
async function loadRentals() {
    const tableContainer = document.getElementById('rental-table-container');
    tableContainer.innerHTML = '<p class="loading-message">Duke ngarkuar rezervimet...</p>';
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/rentals/myrentals', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load rentals');
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
                        <th>Veprime</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        rentals.forEach(rental => {
            // Format dates
            const startDate = new Date(rental.startDate).toLocaleDateString('sq-AL');
            const endDate = new Date(rental.endDate).toLocaleDateString('sq-AL');
            
            // Determine status class and translation
            const statusClass = `status-${rental.status}`;
            let statusText;
            switch(rental.status) {
                case 'pending': statusText = 'Në Pritje'; break;
                case 'confirmed': statusText = 'Konfirmuar'; break;
                case 'completed': statusText = 'Përfunduar'; break;
                case 'cancelled': statusText = 'Anuluar'; break;
                default: statusText = rental.status;
            }
            
            // Determine payment status
            const paymentStatus = rental.isPaid ? 'Paguar' : 'Jo e paguar';
            
            // Determine if this rental can be cancelled
            const canCancel = rental.status === 'pending' || rental.status === 'confirmed';
            const now = new Date();
            const rentalStart = new Date(rental.startDate);
            // Only allow cancellation if start date is at least 24 hours away
            const cancellationDeadlinePassed = (rentalStart - now) < 24 * 60 * 60 * 1000;
            
            tableHTML += `
                <tr>
                    <td>
                        <div class="car-info-cell">
                            <img src="images/${rental.car.image}" alt="${rental.car.name}">
                            <span>${rental.car.name}</span>
                        </div>
                    </td>
                    <td>${startDate}</td>
                    <td>${endDate}</td>
                    <td>${rental.totalPrice} €</td>
                    <td><span class="rental-status ${statusClass}">${statusText}</span></td>
                    <td>${paymentStatus}</td>
                    <td>
                        ${canCancel && !cancellationDeadlinePassed ? 
                            `<button class="action-btn cancel-btn" data-rental-id="${rental._id}">Anulo</button>` : 
                            rental.status === 'pending' || rental.status === 'confirmed' ? 
                                '<span class="info-text" title="Nuk mund të anuloni këtë rezervim sepse afati i fundit i anulimit ka kaluar">Afat i kaluar</span>' : 
                                ''}
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        tableContainer.innerHTML = tableHTML;
        
        // Add event listeners to cancel buttons
        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Jeni të sigurt që dëshironi të anuloni këtë rezervim?')) {
                    cancelRental(this.getAttribute('data-rental-id'));
                }
            });
        });
        
    } catch (error) {
        console.error('Error loading rentals:', error);
        tableContainer.innerHTML = `<p class="error-message">Gabim: ${error.message}</p>`;
    }
}

// Function to cancel a rental
async function cancelRental(rentalId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/rentals/${rentalId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'cancelled' })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to cancel rental');
        }
        
        // Show success message
        alert('Rezervimi u anulua me sukses!');
        
        // Reload rentals
        loadRentals();
        
    } catch (error) {
        console.error('Error cancelling rental:', error);
        alert(`Gabim: ${error.message}`);
    }
}