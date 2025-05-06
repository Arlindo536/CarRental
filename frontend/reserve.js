document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !userInfo._id) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Get car ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (!carId) {
        // Redirect to cars page if no car ID provided
        window.location.href = 'index.html#cars';
        return;
    }
    
    // Set minimum dates for date inputs
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    document.getElementById('startDate').min = formatDate(today);
    document.getElementById('endDate').min = formatDate(tomorrow);
    
    // Set car ID in hidden field
    document.getElementById('carId').value = carId;
    
    // Load car details
    loadCarDetails(carId);
    
    // Setup date change listeners
    document.getElementById('startDate').addEventListener('change', updatePriceSummary);
    document.getElementById('endDate').addEventListener('change', updatePriceSummary);
    
    // Setup form submission
    document.getElementById('reserve-form').addEventListener('submit', reserveCar);
});

// Function to load car details
function loadCarDetails(carId) {
    try {
        // Get car from our hardcoded car data
        const car = getCarById(carId);
        
        if (!car) {
            throw new Error('Makina nuk u gjet');
        }
        
        // Display car image
        document.getElementById('car-image').style.backgroundImage = `url('images/${car.image}')`;
        
        // Display car info
        const carInfo = document.getElementById('car-info');
        carInfo.innerHTML = `
            <h3>${car.name} (${car.year})</h3>
            <p><strong>Pasagjerë:</strong> ${car.passengers}</p>
            <p><strong>Transmisioni:</strong> ${car.transmission}</p>
            <p><strong>Valixhe:</strong> ${car.luggage}</p>
            <p><strong>Veçori:</strong> ${car.features.join(', ')}</p>
            <p class="car-price">${car.price}€ / ditë</p>
        `;
        
        // Set price in price summary
        document.getElementById('price-per-day').textContent = `${car.price} €`;
        
        // Store car price as a data attribute for calculations
        document.getElementById('price-summary').setAttribute('data-price', car.price);
        
        // Update price summary
        updatePriceSummary();
        
    } catch (error) {
        document.getElementById('errorAlert').textContent = error.message;
        document.getElementById('errorAlert').style.display = 'block';
    }
}

// Function to update price summary
function updatePriceSummary() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Validate dates
        if (end <= start) {
            document.getElementById('errorAlert').textContent = 'Data e dorëzimit duhet të jetë pas datës së marrjes';
            document.getElementById('errorAlert').style.display = 'block';
            document.getElementById('num-days').textContent = '0';
            document.getElementById('total-price').textContent = '0 €';
            return;
        }
        
        document.getElementById('errorAlert').style.display = 'none';
        
        // Calculate number of days
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Get price per day
        const pricePerDay = parseFloat(document.getElementById('price-summary').getAttribute('data-price'));
        
        // Calculate total price
        const totalPrice = pricePerDay * diffDays;
        
        // Update price summary
        document.getElementById('num-days').textContent = diffDays;
        document.getElementById('total-price').textContent = `${totalPrice} €`;
    }
}

// Function to reserve car
async function reserveCar(e) {
    e.preventDefault();
    
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    
    // Hide alerts
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
    
    // Get form data
    const carId = document.getElementById('carId').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
        errorAlert.textContent = 'Data e dorëzimit duhet të jetë pas datës së marrjes';
        errorAlert.style.display = 'block';
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/rentals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                carId,
                startDate,
                endDate,
                paymentMethod
            })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Gabim gjatë rezervimit');
        }
        
        // Show success message
        successAlert.textContent = 'Rezervimi u krye me sukses!';
        successAlert.style.display = 'block';
        
        // Redirect to profile page after delay
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
        
    } catch (error) {
        errorAlert.textContent = error.message;
        errorAlert.style.display = 'block';
    }
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}