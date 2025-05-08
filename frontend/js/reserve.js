document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !userInfo._id) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Get car ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (!carId) {
        alert('Gabim: ID e makinës mungon');
        window.location.href = 'index.html#cars';
        return;
    }
    
    // References to form elements
    const carImage = document.getElementById('car-image');
    const carInfo = document.getElementById('car-info');
    const reserveForm = document.getElementById('reserve-form');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const pricePerDay = document.getElementById('price-per-day');
    const numDays = document.getElementById('num-days');
    const totalPrice = document.getElementById('total-price');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    
    // Set min dates for date inputs (today and tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    startDateInput.min = formatDateForInput(today);
    endDateInput.min = formatDateForInput(tomorrow);
    
    // Load car details
    async function loadCarDetails() {
        try {
            const car = await cars.getById(carId);
            
            // Update car info
            carImage.style.backgroundImage = `url('images/${car.image}')`;
            
            carInfo.innerHTML = `
                <h3>${car.name} (${car.year})</h3>
                <p><strong>Pasagjerë:</strong> ${car.passengers}</p>
                <p><strong>Transmisioni:</strong> ${car.transmission}</p>
                <p><strong>Valixhe:</strong> ${car.luggage}</p>
                <p><strong>Veçori:</strong> ${car.features.join(', ')}</p>
                <p class="car-price">${car.price}€ / ditë</p>
            `;
            
            // Set price per day in the summary
            pricePerDay.textContent = `${car.price} €`;
            document.getElementById('carId').value = car._id;
            
            // Calculate total when dates change
            startDateInput.addEventListener('change', calculateTotal);
            endDateInput.addEventListener('change', calculateTotal);
            
            function calculateTotal() {
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                
                if (startDate && endDate && startDate < endDate) {
                    // Calculate number of days
                    const diffTime = Math.abs(endDate - startDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    numDays.textContent = diffDays;
                    totalPrice.textContent = `${diffDays * car.price} €`;
                } else {
                    numDays.textContent = '0';
                    totalPrice.textContent = '0 €';
                }
            }
            
        } catch (error) {
            console.error('Error loading car details:', error);
            alert('Gabim gjatë ngarkimit të të dhënave të makinës');
            window.location.href = 'index.html#cars';
        }
    }
    
    loadCarDetails();
    
    // Handle form submission
    if (reserveForm) {
        reserveForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide any existing alerts
            errorAlert.style.display = 'none';
            successAlert.style.display = 'none';
            
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            const paymentMethod = document.getElementById('paymentMethod').value;
            
            // Validate dates
            if (!startDate || !endDate || startDate >= endDate) {
                errorAlert.textContent = 'Ju lutemi zgjidhni data të vlefshme';
                errorAlert.style.display = 'block';
                return;
            }
            
            // Calculate total price
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const price = parseInt(pricePerDay.textContent);
            const totalPriceValue = diffDays * price;
            
            try {
                // Create rental
                const rentalData = {
                    carId: document.getElementById('carId').value,
                    startDate,
                    endDate,
                    paymentMethod,
                    totalPrice: totalPriceValue
                };
                
                const result = await rentals.create(rentalData);
                
                // Show success message
                successAlert.textContent = 'Rezervimi u krye me sukses!';
                successAlert.style.display = 'block';
                
                // Redirect to profile page after delay
                setTimeout(() => {
                    window.location.href = 'profile.html?tab=rental-history';
                }, 2000);
                
            } catch (error) {
                // Show error message
                errorAlert.textContent = error.message || 'Gabim gjatë rezervimit';
                errorAlert.style.display = 'block';
            }
        });
    }
});