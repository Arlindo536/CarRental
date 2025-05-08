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
        // Use the rentals module from config.js
        const allRentals = await rentals.getAllAdmin();
        
        if (allRentals.length === 0) {
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
        
        allRentals.forEach(rental => {
            // Format dates
            const startDate = new Date(rental.startDate).toLocaleDateString('sq-AL');
            const endDate = new Date(rental.endDate).toLocaleDateString('sq-AL');
            const createdAt = new Date(rental.createdAt).toLocaleDateString('sq-AL');
            
            // Translate status
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
        await rentals.updateStatus(rentalId, status);
        
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
        await rentals.deleteAdmin(rentalId);
        
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
        const allCars = await cars.getAll();
        
        if (allCars.length === 0) {
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
        
        allCars.forEach(car => {
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
        
        // Add event listeners
        document.querySelectorAll('.availability-toggle').forEach(toggle => {
            toggle.addEventListener('change', function() {
                updateCarAvailability(this.getAttribute('data-car-id'), this.checked);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const carId = this.getAttribute('data-car-id');
                const car = allCars.find(c => c._id === carId);
                if (car) {
                    showEditCarForm(car);
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                deleteCar(this.getAttribute('data-car-id'));
            });
        });
        
    } catch (error) {
        tableContainer.innerHTML = `<p class="error-message">Gabim: ${error.message}</p>`;
    }
}

// Function to update car availability
async function updateCarAvailability(carId, isAvailable) {
    try {
        await cars.update(carId, { isAvailable });
        alert('Disponueshmëria u përditësua!');
    } catch (error) {
        alert(`Gabim: ${error.message}`);
        // Reset toggle to original state
        const toggle = document.querySelector(`.availability-toggle[data-car-id="${carId}"]`);
        if (toggle) {
            toggle.checked = !isAvailable;
        }
    }
}

// Function to delete car
async function deleteCar(carId) {
    if (!confirm('Jeni të sigurt që dëshironi të fshini këtë makinë?')) {
        return;
    }
    
    try {
        await cars.delete(carId);
        alert('Makina u fshi me sukses!');
        loadCars();
    } catch (error) {
        alert(`Gabim: ${error.message}`);
    }
}

// Function to show add car form
function showAddCarForm() {
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
                <div class="form-group">
                    <label for="year">Viti</label>
                    <input type="number" id="year" name="year" min="2000" max="2030" required>
                </div>
                <div class="form-group">
                    <label for="passengers">Pasagjerë</label>
                    <input type="number" id="passengers" name="passengers" min="1" max="10" required>
                </div>
                <div class="form-group">
                    <label for="transmission">Transmisioni</label>
                    <select id="transmission" name="transmission" required>
                        <option value="Automatike">Automatike</option>
                        <option value="Manuale">Manuale</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="luggage">Valixhe</label>
                    <input type="number" id="luggage" name="luggage" min="0" max="10" required>
                </div>
                <div class="form-group">
                    <label for="price">Çmimi / Ditë (€)</label>
                    <input type="number" id="price" name="price" min="1" required>
                </div>
                <div class="form-group">
                    <label for="image">Foto (emri i skedarit)</label>
                    <input type="text" id="image" name="image" required>
                </div>
                <div class="form-group">
                    <label for="features">Veçori (ndaj me presje)</label>
                    <input type="text" id="features" name="features" required>
                </div>
                <button type="submit" class="action-btn">Shto Makinë</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking on X
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Handle form submission
    const form = modal.querySelector('#add-car-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect form data
        const carData = {
            name: form.name.value,
            type: form.type.value,
            year: parseInt(form.year.value),
            passengers: parseInt(form.passengers.value),
            transmission: form.transmission.value,
            luggage: parseInt(form.luggage.value),
            price: parseInt(form.price.value),
            image: form.image.value,
            features: form.features.value.split(',').map(feature => feature.trim()),
            isAvailable: true
        };
        
        try {
            await cars.create(carData);
            alert('Makina u shtua me sukses!');
            document.body.removeChild(modal);
            loadCars();
        } catch (error) {
            alert(`Gabim: ${error.message}`);
        }
    });
}

// Function to show edit car form
function showEditCarForm(car) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Edito Makinën</h3>
            <form id="edit-car-form">
                <input type="hidden" id="car-id" value="${car._id}">
                <div class="form-group">
                    <label for="name">Emri</label>
                    <input type="text" id="name" name="name" value="${car.name}" required>
                </div>
                <div class="form-group">
                    <label for="type">Tipi</label>
                    <select id="type" name="type" required>
                        <option value="ekonomik" ${car.type === 'ekonomik' ? 'selected' : ''}>Ekonomik</option>
                        <option value="familjar" ${car.type === 'familjar' ? 'selected' : ''}>Familjar</option>
                        <option value="luksoz" ${car.type === 'luksoz' ? 'selected' : ''}>Luksoz</option>
                        <option value="suv" ${car.type === 'suv' ? 'selected' : ''}>SUV</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="year">Viti</label>
                    <input type="number" id="year" name="year" min="2000" max="2030" value="${car.year}" required>
                </div>
                <div class="form-group">
                    <label for="passengers">Pasagjerë</label>
                    <input type="number" id="passengers" name="passengers" min="1" max="10" value="${car.passengers}" required>
                </div>
                <div class="form-group">
                    <label for="transmission">Transmisioni</label>
                    <select id="transmission" name="transmission" required>
                        <option value="Automatike" ${car.transmission === 'Automatike' ? 'selected' : ''}>Automatike</option>
                        <option value="Manuale" ${car.transmission === 'Manuale' ? 'selected' : ''}>Manuale</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="luggage">Valixhe</label>
                    <input type="number" id="luggage" name="luggage" min="0" max="10" value="${car.luggage}" required>
                </div>
                <div class="form-group">
                    <label for="price">Çmimi / Ditë (€)</label>
                    <input type="number" id="price" name="price" min="1" value="${car.price}" required>
                </div>
                <div class="form-group">
                    <label for="image">Foto (emri i skedarit)</label>
                    <input type="text" id="image" name="image" value="${car.image}" required>
                </div>
                <div class="form-group">
                    <label for="features">Veçori (ndaj me presje)</label>
                    <input type="text" id="features" name="features" value="${car.features.join(', ')}" required>
                </div>
                <div class="form-group">
                    <label for="isAvailable">Disponueshmëria</label>
                    <select id="isAvailable" name="isAvailable">
                        <option value="true" ${car.isAvailable ? 'selected' : ''}>E disponueshme</option>
                        <option value="false" ${!car.isAvailable ? 'selected' : ''}>E padisponueshme</option>
                    </select>
                </div>
                <button type="submit" class="action-btn">Ruaj Ndryshimet</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking on X
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Handle form submission
    const form = modal.querySelector('#edit-car-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const carId = form.querySelector('#car-id').value;
        
        // Collect form data
        const carData = {
            name: form.name.value,
            type: form.type.value,
            year: parseInt(form.year.value),
            passengers: parseInt(form.passengers.value),
            transmission: form.transmission.value,
            luggage: parseInt(form.luggage.value),
            price: parseInt(form.price.value),
            image: form.image.value,
            features: form.features.value.split(',').map(feature => feature.trim()),
            isAvailable: form.isAvailable.value === 'true'
        };
        
        try {
            await cars.update(carId, carData);
            alert('Makina u përditësua me sukses!');
            document.body.removeChild(modal);
            loadCars();
        } catch (error) {
            alert(`Gabim: ${error.message}`);
        }
    });
}

// Function to load all users for admin
async function loadUsers() {
    const tableContainer = document.getElementById('users-table-container');
    tableContainer.innerHTML = '<p class="loading-message">Duke ngarkuar përdoruesit...</p>';
    
    try {
        const allUsers = await users.getAll();
        
        if (allUsers.length === 0) {
            tableContainer.innerHTML = '<p class="empty-message">Nuk ka përdorues për të shfaqur.</p>';
            return;
        }
        
        // Create table with users
        let tableHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Emri</th>
                        <th>Email</th>
                        <th>Roli</th>
                        <th>Data e Regjistrimit</th>
                        <th>Veprime</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        allUsers.forEach(user => {
            // Format date
            const createdAt = new Date(user.createdAt).toLocaleDateString('sq-AL');
            
            tableHTML += `
                <tr>
                    <td>${user._id.substring(0, 8)}...</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.isAdmin ? 'Admin' : 'Përdorues'}</td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="action-btn edit-btn" data-user-id="${user._id}">Edito</button>
                        <button class="action-btn delete-btn" data-user-id="${user._id}" ${user.isAdmin ? 'disabled' : ''}>Fshi</button>
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        tableContainer.innerHTML = tableHTML;
        
        // Add event listeners
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                const user = allUsers.find(u => u._id === userId);
                if (user) {
                    showEditUserForm(user);
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', function() {
                    deleteUser(this.getAttribute('data-user-id'));
                });
            }
        });
        
    } catch (error) {
        tableContainer.innerHTML = `<p class="error-message">Gabim: ${error.message}</p>`;
    }
}

// Function to show edit user form
function showEditUserForm(user) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Edito Përdoruesin</h3>
            <form id="edit-user-form">
                <input type="hidden" id="user-id" value="${user._id}">
                <div class="form-group">
                    <label for="name">Emri</label>
                    <input type="text" id="name" name="name" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="password">Fjalëkalimi i Ri (lëre bosh për të mos e ndryshuar)</label>
                    <input type="password" id="password" name="password">
                </div>
                <div class="form-group">
                    <label for="isAdmin">Roli</label>
                    <select id="isAdmin" name="isAdmin">
                        <option value="false" ${!user.isAdmin ? 'selected' : ''}>Përdorues</option>
                        <option value="true" ${user.isAdmin ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <button type="submit" class="action-btn">Ruaj Ndryshimet</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking on X
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Handle form submission
    const form = modal.querySelector('#edit-user-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userId = form.querySelector('#user-id').value;
        
        // Collect form data
        const userData = {
            name: form.name.value,
            email: form.email.value,
            isAdmin: form.isAdmin.value === 'true'
        };
        
        // Only include password if it's provided
        if (form.password.value) {
            userData.password = form.password.value;
        }
        
        try {
            await users.update(userId, userData);
            alert('Përdoruesi u përditësua me sukses!');
            document.body.removeChild(modal);
            loadUsers();
        } catch (error) {
            alert(`Gabim: ${error.message}`);
        }
    });
}

// Function to delete user
async function deleteUser(userId) {
    if (!confirm('Jeni të sigurt që dëshironi të fshini këtë përdorues?')) {
        return;
    }
    
    try {
        await users.delete(userId);
        alert('Përdoruesi u fshi me sukses!');
        loadUsers();
    } catch (error) {
        alert(`Gabim: ${error.message}`);
    }
}