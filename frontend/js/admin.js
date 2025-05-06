document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is admin
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !userInfo._id || !userInfo.isAdmin) {
        // Redirect to login page if not logged in or not admin
        window.location.href = 'login.html';
        return;
    }
    
    // Set up tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const adminTabs = document.querySelectorAll('.admin-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            adminTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Load data based on selected tab
            if (tabId === 'all-rentals') {
                loadAllRentals();
            } else if (tabId === 'car-management') {
                loadCars();
            } else if (tabId === 'user-management') {
                loadUsers();
            }
        });
    });
    
    // Setup logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
    
    // Setup add car button
    const addCarBtn = document.getElementById('add-car-btn');
    if (addCarBtn) {
        addCarBtn.addEventListener('click', showAddCarForm);
    }
    
    // Load rentals data initially
    loadAllRentals();
});

// Function to load all rentals for admin
async function loadAllRentals() {
    const tableContainer = document.getElementById('rentals-table-container');
    tableContainer.innerHTML = '<p class="loading-message">Duke ngarkuar rezervimet...</p>';
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/rentals/admin', {
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
            tableContainer.innerHTML = '<p class="empty-message">Nuk ka rezervime për të shfaqur.</p>';
            return;
        }
        
        // Create table with rentals
        let tableHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Përdoruesi</th>
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
            const createdAt = new Date(rental.createdAt).toLocaleDateString('sq-AL');
            
            // Determine status class
            const statusClass = `status-${rental.status}`;
            
            // Determine payment status
            const paymentStatus = rental.isPaid ? 'Paguar' : 'Jo e paguar';
            
            tableHTML += `
                <tr>
                    <td title="Krijuar më: ${createdAt}">${rental._id.substring(0, 8)}...</td>
                    <td>${rental.user.name}</td>
                    <td>
                        <div class="car-info-cell">
                            <img src="images/${rental.car.image}" alt="${rental.car.name}">
                            <span>${rental.car.name}</span>
                        </div>
                    </td>
                    <td>${startDate}</td>
                    <td>${endDate}</td>
                    <td>${rental.totalPrice} €</td>
                    <td>
                        <select class="status-select" data-rental-id="${rental._id}">
                            <option value="pending" ${rental.status === 'pending' ? 'selected' : ''}>Në Pritje</option>
                            <option value="confirmed" ${rental.status === 'confirmed' ? 'selected' : ''}>Konfirmuar</option>
                            <option value="completed" ${rental.status === 'completed' ? 'selected' : ''}>Përfunduar</option>
                            <option value="cancelled" ${rental.status === 'cancelled' ? 'selected' : ''}>Anuluar</option>
                        </select>
                    </td>
                    <td>${paymentStatus}</td>
                    <td>
                        <button class="action-btn delete-btn" data-rental-id="${rental._id}">Fshi</button>
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        tableContainer.innerHTML = tableHTML;
        
        // Add event listeners to status selects
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', function() {
                updateRentalStatus(this.getAttribute('data-rental-id'), this.value);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                deleteRental(this.getAttribute('data-rental-id'));
            });
        });
        
    } catch (error) {
        tableContainer.innerHTML = `<p class="error-message">Gabim: ${error.message}</p>`;
    }
}

// Function to update rental status
async function updateRentalStatus(rentalId, status) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/rentals/${rentalId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update status');
        }
        
        // Show success message
        alert('Statusi u përditësua me sukses!');
        
    } catch (error) {
        alert(`Gabim: ${error.message}`);
    }
}

// Function to delete rental
async function deleteRental(rentalId) {
    if (!confirm('Jeni të sigurt që dëshironi të fshini këtë rezervim?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/rentals/${rentalId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete rental');
        }
        
        // Show success message
        alert('Rezervimi u fshi me sukses!');
        
        // Reload rentals
        loadAllRentals();
        
    } catch (error) {
        alert(`Gabim: ${error.message}`);
    }
}

// Function to load all cars for management
async function loadCars() {
    const tableContainer = document.getElementById('cars-table-container');
    tableContainer.innerHTML = '<p class="loading-message">Duke ngarkuar makinat...</p>';
    
    try {
        const response = await fetch('/api/cars');
        
        if (!response.ok) {
            throw new Error('Failed to load cars');
        }
        
        const cars = await response.json();
        
        if (cars.length === 0) {
            tableContainer.innerHTML = '<p class="empty-message">Nuk ka makina për të shfaqur.</p>';
            return;
        }
        
        // Create table with cars
        let tableHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Emri</th>
                        <th>Tipi</th>
                        <th>Viti</th>
                        <th>Çmimi/Ditë</th>
                        <th>Disponueshmëria</th>
                        <th>Veprime</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        cars.forEach(car => {
            tableHTML += `
                <tr>
                    <td><img src="images/${car.image}" alt="${car.name}" class="car-thumbnail"></td>
                    <td>${car.name}</td>
                    <td>${car.type}</td>
                    <td>${car.year}</td>
                    <td>${car.price} €</td>
                    <td>
                        <label class="switch">
                            <input type="checkbox" class="availability-toggle" data-car-id="${car._id}" ${car.isAvailable ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </td>
                    <td>
                        <button class="action-btn edit-btn" data-car-id="${car._id}">Edito</button>
                        <button class="action-btn delete-btn" data-car-id="${car._id}">Fshi</button>
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        tableContainer.innerHTML = tableHTML;
        
        // Add event listeners for buttons and toggles
        setupCarEventListeners(cars);
        
    } catch (error) {
        tableContainer.innerHTML = `<p class="error-message">Gabim: ${error.message}</p>`;
    }
}

// Setup car management event listeners
function setupCarEventListeners(cars) {
    // Add event listeners to availability toggles
    document.querySelectorAll('.availability-toggle').forEach(toggle => {
        toggle.addEventListener('change', function() {
            updateCarAvailability(this.getAttribute('data-car-id'), this.checked);
        });
    });
    
    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const carId = this.getAttribute('data-car-id');
            const car = cars.find(c => c._id === carId);
            if (car) {
                showEditCarForm(car);
            }
        });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            deleteCar(this.getAttribute('data-car-id'));
        });
    });
}

// Functions for car form management
function showAddCarForm() {
    // Modal implementation for adding new cars
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Shto Makinë të Re</h3>
            <form id="add-car-form">
                <div class="form-group">
                    <label for="name">Emri</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="type">Tipi</label>
                    <select id="type" name="type" required>
                        <option value="ekonomik">Ekonomik</option>
                        <option value="familjar">Familjar</option>
                        <option value="luksoz">Luksoz</option>
                        <option value="suv">SUV</option>
                    </select>
                </div>
                <!-- More form fields -->
                <button type="submit" class="action-btn">Shto Makinë</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalEventListeners(modal);
}

// More functions for car management, user management, etc.
// (Additional functionality omitted for brevity)