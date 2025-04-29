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

// Company contact info
const contactInfo = {
    phone: '+355 69 943 8569',
    whatsapp: '+355 69 943 8569',
    email: 'dishiarlindo@gmail.com'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Display cars
    displayCars();

    // Setup car filter
    document.getElementById('car-type').addEventListener('change', filterCars);

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
                <div class="contact-buttons">
                    <a href="tel:${contactInfo.phone}" class="contact-btn phone-btn"><i class="fas fa-phone"></i> Telefono</a>
                    <a href="https://wa.me/${contactInfo.whatsapp.replace(/\s+/g, '')}" class="contact-btn whatsapp-btn" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                    <a href="mailto:${contactInfo.email}?subject=Interes për ${car.name}&body=Përshëndetje, jam i interesuar për makinën ${car.name} me çmim ${car.price}€ / ditë. Ju lutem më kontaktoni për të diskutuar në detaje." class="contact-btn email-btn"><i class="fas fa-envelope"></i> Email</a>
                </div>
            </div>
        `;
        carsContainer.appendChild(carElement);
    });

    // If no cars match the filter
    if (filteredCars.length === 0) {
        carsContainer.innerHTML = '<p>Nuk u gjetën makina që përputhen me kriteret e kërkimit.</p>';
    }
}

// Function to filter cars
function filterCars() {
    const filter = document.getElementById('car-type').value;
    displayCars(filter);
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    // FormSubmit.co already handles form submission, but you can add extra validation if needed
    form.addEventListener('submit', function(e) {
        // You can add form validation here if needed, such as:
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation example (optional)
        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            e.preventDefault();
            alert('Ju lutemi plotësoni të gjitha fushat!');
            return false;
        }
        
        // No need to prevent default or show alert since we're submitting to FormSubmit.co
        // The form will redirect to the thank you page automatically
    });
}


  
// Google Maps initialization
function initMap() {
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

// Setup mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const languageSelector = document.querySelector('.language-selector');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        languageSelector.classList.toggle('active');
      });
    }
  }
  
  // Call this function after DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    // ...other initialization code
  });
