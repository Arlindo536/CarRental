/* ============================================================
   map.js  –  Leaflet map initialisation
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const mapEl = document.getElementById("map");
    if (!mapEl || typeof L === "undefined") return;

    const map = L.map("map").setView([41.3275, 19.8187], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
    }).addTo(map);

    const t = key => (window.I18N && window.I18N[key]) ? window.I18N[key] : key;

    const locations = [
        {
            coords:  [41.3275, 19.8187],
            nameKey: "location_tirana_name",
            addrKey: "location_tirana_address",
            hrKey:   "location_tirana_hours"
        },
        {
            coords:  [41.4147, 19.7206],
            nameKey: "location_airport_name",
            addrKey: "location_airport_address",
            hrKey:   "location_airport_hours"
        }
    ];

    locations.forEach(loc => {
        L.marker(loc.coords)
            .addTo(map)
            .bindPopup(`
                <strong>${t(loc.nameKey)}</strong><br>
                ${t(loc.addrKey)}<br>
                <em>${t(loc.hrKey)}</em>
            `);
    });

    /* Force render after CSS layout settles */
    setTimeout(() => map.invalidateSize(), 250);
});
