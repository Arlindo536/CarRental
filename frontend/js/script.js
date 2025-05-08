const carsData = [
    {
        id: 1,
        name: 'Toyota Corolla',
        type: 'ekonomik',
        year: 2022,
        passengers: 5,
        transmission: 'Automatike',
        luggage: 2,
        price: 35,
        image: 'toyota-corolla.jpg',
        features: ['Klimë', 'Bluetooth', 'Kamera Parkimi']
    },
    {
        id: 2,
        name: 'Mercedes C-Class',
        type: 'luksoz',
        year: 2023,
        passengers: 5,
        transmission: 'Automatike',
        luggage: 3,
        price: 75,
        image: 'mercedes-c-class.jpg',
        features: ['Klimë', 'Navigacion', 'Sedilje Lëkure', 'Kamera Parkimi']
    },
    {
        id: 3,
        name: 'Volkswagen Tiguan',
        type: 'suv',
        year: 2022,
        passengers: 5,
        transmission: 'Automatike',
        luggage: 4,
        price: 65,
        image: 'vw-tiguan.jpg',
        features: ['Klimë', 'Navigacion', 'Sensorë Parkimi', '4x4']
    },
    {
        id: 4,
        name: 'Dacia Duster',
        type: 'suv',
        year: 2021,
        passengers: 5,
        transmission: 'Manuale',
        luggage: 3,
        price: 40,
        image: 'dacia-duster.jpg',
        features: ['Klimë', 'Bluetooth', 'Sensorë Parkimi']
    },
    {
        id: 5,
        name: 'Fiat 500',
        type: 'ekonomik',
        year: 2022,
        passengers: 4,
        transmission: 'Manuale',
        luggage: 1,
        price: 30,
        image: 'fiat-500.jpg',
        features: ['Klimë', 'Bluetooth']
    },
    {
        id: 6,
        name: 'BMW X5',
        type: 'luksoz',
        year: 2023,
        passengers: 7,
        transmission: 'Automatike',
        luggage: 5,
        price: 90,
        image: 'bmw-x5.jpg',
        features: ['Klimë', 'Navigacion', 'Sedilje Lëkure', 'Kamera 360']
    },
    // Additional cars
    {
        id: 7,
        name: 'Audi A4',
        type: 'luksoz',
        year: 2022,
        passengers: 5,
        transmission: 'Automatike',
        luggage: 3,
        price: 70,
        image: 'audi-a4.jpg',
        features: ['Klimë', 'Navigacion', 'Sedilje Lëkure', 'Bluetooth']
    },
    {
        id: 8,
        name: 'Skoda Octavia',
        type: 'ekonomik',
        year: 2021,
        passengers: 5,
        transmission: 'Automatike',
        luggage: 3,
        price: 45,
        image: 'skoda-octavia.jpg',
        features: ['Klimë', 'Bluetooth', 'Android Auto']
    },
    {
        id: 9,
        name: 'Hyundai Tucson',
        type: 'suv',
        year: 2023,
        passengers: 5,
        transmission: 'Automatike',
        luggage: 4,
        price: 60,
        image: 'hyundai-tucson.jpg',
        features: ['Klimë', 'Bluetooth', 'Kamera Parkimi', 'Navigacion']
    },
    {
        id: 10,
        name: 'VW Golf 7',
        type: 'ekonomik',
        year: 2022,
        passengers: 5,
        transmission: 'Manuale',
        luggage: 2,
        price: 32,
        image: 'vw-golf-7.jpg',
        features: ['Klimë', 'Bluetooth', 'Sensorë Parkimi']
    },
    {
        id: 11,
        name: 'Peugeot 3008',
        type: 'suv',
        year: 2022,
        passengers: 5,
        transmission: 'Automatike',
        luggage: 4,
        price: 55,
        image: 'peugeot-3008.jpg',
        features: ['Klimë', 'Navigacion', 'Bluetooth', 'Kamera Parkimi']
    },
    {
        id: 12,
        name: 'Tesla Model 3',
        type: 'luksoz',
        year: 2023,
        passengers: 5,
        transmission: 'Automatike',
        luggage: 2,
        price: 85,
        image: 'tesla-model3.jpg',
        features: ['Autopilot', 'Navigacion', 'Kamerat', 'Karikues']
    }
];

// Company contact info
const contactInfo = {
    phone: '+355 69 943 8569',
    whatsapp: '+355 69 943 8569',
    email: 'dishiarlindo@gmail.com'
};

// Locations data
const locations = [
    {
        id: 'qender',
        name: 'Qendra Tiranë',
        address: 'Rruga e Durrësit, Nr. 23, Tiranë',
        hours: '08:00 - 20:00, E Hënë - E Dielë',
        coordinates: { lat: 41.3275, lng: 19.8187 }
    },
    {
        id: 'aeroport',
        name: 'Aeroporti i Tiranës',
        address: 'Terminali i Mbërritjeve, Rinas',
        hours: '24/7',
        coordinates: { lat: 41.4147, lng: 19.7206 }
    }
];

// Helper function for authenticated API calls
async function fetchWithAuth(url, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    return response;
}

// // Function to fetch cars from API
// async function fetchCars() {
//     try {
//         const response = await fetch('/api/cars');
        
//         if (!response.ok) {
//             throw new Error('Failed to fetch cars');
//         }
        
//         cars = await response.json();
//         console.log('Cars fetched:', cars);
        
//         // Display cars
//         displayCars();
//     } catch (error) {
//         console.error('Error fetching cars:', error);
//     }
// }

function displayCars(filter = '') {
    const carsContainer = document.querySelector('.cars-container');
    if (!carsContainer) {
        console.error('No cars container found!');
        return;
    }
    
    carsContainer.innerHTML = '<p class="loading-message">Duke ngarkuar makinat...</p>';
    
    // Use direct fetch instead of the cars.getAll() function
    fetch('http://localhost:5000/api/cars')
        .then(response => response.json())
        .then(carsData => {
            console.log('Cars data received:', carsData);
            
            // Filter cars if needed
            const filteredCars = filter ? carsData.filter(car => car.type === filter) : carsData;
            
            console.log('Filtered cars:', filteredCars);
            
            if (filteredCars.length === 0) {
                carsContainer.innerHTML = '<p>Nuk u gjetën makina që përputhen me kriteret e kërkimit.</p>';
                return;
            }
            
            // Clear loading message
            carsContainer.innerHTML = '';
            
            // Create car elements
            filteredCars.forEach(car => {
                console.log('Creating element for car:', car.name);
                
                const carElement = document.createElement('div');
                carElement.className = 'car-card';
                carElement.innerHTML = `
                    <div class="car-image" style="background-image: url('/images/${car.image}')"></div>
                    <div class="car-details">
                        <h3>${car.name} (${car.year})</h3>
                        <p><strong>Pasagjerë:</strong> ${car.passengers}</p>
                        <p><strong>Transmisioni:</strong> ${car.transmission}</p>
                        <p><strong>Valixhe:</strong> ${car.luggage}</p>
                        <p><strong>Veçori:</strong> ${car.features.join(', ')}</p>
                        <p class="car-price">${car.price}€ / ditë</p>
                        <div class="contact-buttons">
                            <a href="tel:${contactInfo.phone}" class="contact-btn phone-btn"><i class="fas fa-phone"></i> Telefono</a>
                            <a href="https://wa.me/${contactInfo.whatsapp.replace(/\s+/g, '')}" class="contact-btn whatsapp-btn" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                            <a href="mailto:${contactInfo.email}?subject=Interes për ${car.name}&body=Përshëndetje, jam i interesuar për makinën ${car.name} me çmim ${car.price}€ / ditë. Ju lutem më kontaktoni për të diskutuar në detaje." class="contact-btn email-btn"><i class="fas fa-envelope"></i> Email</a>
                        </div>
                        <a href="reserve.html?id=${car._id}" class="btn reserve-btn" style="margin-top: 15px; width: 100%; text-align: center;">Rezervo Tani</a>
                    </div>
                `;
                carsContainer.appendChild(carElement);
            });
        })
        .catch(error => {
            console.error('Error fetching cars:', error);
            carsContainer.innerHTML = `<p class="error-message">Gabim gjatë ngarkimit të makinave: ${error.message}</p>`;
        });
}

// Function to filter cars
function filterCars() {
    const filter = document.getElementById('car-type').value;
    displayCars(filter);
}

// Function to setup contact form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            e.preventDefault();
            alert('Ju lutemi plotësoni të gjitha fushat!');
            return false;
        }
    });
}

// Function to update authentication-related UI elements
function updateAuthLinks() {
    const authLinks = document.getElementById('auth-links');
    const profileLink = document.getElementById('profile-link');
    
    if (authLinks && profileLink) {
        const token = localStorage.getItem('token');
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        console.log('Auth status:', { token: !!token, userInfo });
        
        if (token && userInfo._id) {
            // User is logged in
            authLinks.style.display = 'none';
            profileLink.style.display = 'block';
        } else {
            // User is not logged in
            authLinks.style.display = 'block';
            profileLink.style.display = 'none';
        }
    }
}

// Google Maps initialization
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    const map = new google.maps.Map(mapElement, {
        center: { lat: 41.3275, lng: 19.8187 },
        zoom: 10
    });
    
    // Add markers for each location
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location.coordinates,
            map: map,
            title: location.name
        });

        // Create info window for each marker
        const infoContent = `
            <div>
                <h3>${location.name}</h3>
                <p>${location.address}</p>
                <p>Orari: ${location.hours}</p>
            </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
            content: infoContent
        });

        // Show info window when marker is clicked
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    });
}

// Setup mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const languageSelector = document.querySelector('.language-selector');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            if (languageSelector) {
                languageSelector.classList.toggle('active');
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Update auth links
    updateAuthLinks();
    
    // Display cars directly from the hardcoded array
    displayCars();
    
    // Setup car filter if it exists
    const carTypeSelect = document.getElementById('car-type');
    if (carTypeSelect) {
        carTypeSelect.addEventListener('change', filterCars);
    }
    
    // Setup contact form if it exists
    setupContactForm();
    
    console.log('Initialization complete');
});

// Function to logout the user
function logout() {
    console.log('Logging out...');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Function to load user rentals
async function loadRentals() {
    const tableContainer = document.getElementById('rental-table-container');
    if (!tableContainer) return;
    
    tableContainer.innerHTML = '<p class="loading-message">Duke ngarkuar rezervimet...</p>';
    
    try {
        const response = await fetchWithAuth('/api/rentals/myrentals');
        
        if (!response.ok) {
            throw new Error('Failed to load rentals');
        }
        
        const rentals = await response.json();
        console.log('Rentals loaded:', rentals);
        
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
        console.error('Error loading rentals:', error);
        tableContainer.innerHTML = `<p class="empty-message">Gabim: ${error.message}</p>`;
    }
}