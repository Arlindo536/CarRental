
// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});

function initMap() {
    // Check if map container exists
    if (!document.getElementById('map')) return;
    
    // Create a map centered on Tirana
    const map = L.map('map').setView([41.3275, 19.8187], 11);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add markers for each location
    const locations = [
        {
            name: 'Qendra Tiranë',
            address: 'Rruga e Durrësit, Nr. 23, Tiranë',
            hours: '08:00 - 20:00, E Hënë - E Dielë',
            coordinates: [41.3275, 19.8187]
        },
        {
            name: 'Aeroporti i Tiranës',
            address: 'Terminali i Mbërritjeve, Rinas',
            hours: '24/7',
            coordinates: [41.4147, 19.7206]
        }
    ];
    
    // Add markers to the map
    locations.forEach(location => {
        const marker = L.marker(location.coordinates).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div>
                <h3>${location.name}</h3>
                <p>${location.address}</p>
                <p>Orari: ${location.hours}</p>
            </div>
        `;
        
        // Bind popup to marker
        marker.bindPopup(popupContent);
    });
    
    // Make sure the map renders correctly
    setTimeout(function() {
        map.invalidateSize();
    }, 100);
}