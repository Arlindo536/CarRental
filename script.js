// Sample car data (would be fetched from a server in a real application)
const cars = [
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
    }
];

// Locations data (would be fetched from a server in a real application)
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Display cars
    displayCars();

    // Setup car filter
    document.getElementById('car-type').addEventListener('change', filterCars);

    // Setup reservation form
    setupReservationForm();

    // Initialize contact form
    setupContactForm();
});

// Function to display cars
function displayCars(filter = '') {
    const carsContainer = document.querySelector('.cars-container');
    carsContainer.innerHTML = '';

    // Filter cars if needed
    const filteredCars = filter ? cars.filter(car => car.type === filter) : cars;

    // Create car elements
    filteredCars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.className = 'car-card';
        carElement.innerHTML = `
            <div class="car-image" style="background-image: url('images/${car.image}')"></div>
            <div class="car-details">
                <h3>${car.name} (${car.year})</h3>
                <p><strong>Pasagjerë:</strong> ${car.passengers}</p>
                <p><strong>Transmisioni:</strong> ${car.transmission}</p>
                <p><strong>Valixhe:</strong> ${car.luggage}</p>
                <p><strong>Veçori:</strong> ${car.features.join(', ')}</p>
                <p class="car-price">${car.price}€ / ditë</p>
                <a href="#reservation" class="btn" data-car-id="${car.id}">Rezervo</a>
            </div>
        `;
        carsContainer.appendChild(carElement);

        // Add event listener to reservation button
        const reserveBtn = carElement.querySelector('.btn');
        reserveBtn.addEventListener('click', function() {
            document.getElementById('selected-car').value = car.id;
        });
    });

    // If no cars match the filter
    if (filteredCars.length === 0) {
        carsContainer.innerHTML = '<p>Nuk u gjetën makina që përputhen me kriteret e kërkimit.</p>';
    }

    // Populate car options in reservation form
    const carSelect = document.getElementById('selected-car');
    carSelect.innerHTML = '<option value="">Zgjidhni makinën</option>';
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.name} (${car.price}€ / ditë)`;
        carSelect.appendChild(option);
    });
}

// Function to filter cars
function filterCars() {
    const filter = document.getElementById('car-type').value;
    displayCars(filter);
}

// Setup reservation form
function setupReservationForm() {
    const form = document.getElementById('reservation-form');

    // Set minimum dates for the date inputs
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const pickupDateInput = document.getElementById('pickup-date');
    const returnDateInput = document.getElementById('return-date');
    
    pickupDateInput.min = formatDate(today);
    returnDateInput.min = formatDate(tomorrow);
    
    // Make return date at least one day after pickup date
    pickupDateInput.addEventListener('change', function() {
        const pickupDate = new Date(this.value);
        const nextDay = new Date(pickupDate);
        nextDay.setDate(pickupDate.getDate() + 1);
        returnDateInput.min = formatDate(nextDay);
        
        // Reset return date if it's before the new minimum
        if (new Date(returnDateInput.value) < nextDay) {
            returnDateInput.value = formatDate(nextDay);
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, you would send this data to a server
        alert('Rezervimi juaj u pranua! Do t\'ju kontaktojmë së shpejti për konfirmimin.');
        form.reset();
    });
}

// Setup contact form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, you would send this data to a server
        alert('Mesazhi juaj u dërgua! Do t\'ju kontaktojmë së shpejti.');
        form.reset();
    });
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Google Maps initialization
function initMap() {
    // Create a map centered on Tirana
    const map = new google.maps.Map(document.getElementById('map'), {
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