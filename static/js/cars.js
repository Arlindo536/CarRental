/* ============================================================
   cars.js  –  Car data + grid rendering
   window.I18N and window.LANG are set by Flask via base.html
   ============================================================ */

const CARS = [
    {
        id: "audi-a7-2015",
        name: "Audi A7",
        type: "luksoz",
        year: 2015,
        fuel: "Naftë",
        passengers: 5,
        transmission: "auto",
        luggage: 3,
        price: null,
        image: "/static/images/audi-a7-2015.jpg",
        features: ["Klimë", "Bluetooth", "Navigacion"]
    },
    {
        id: "mercedes-ml350-2015",
        name: "Mercedes-Benz ML 350",
        type: "suv",
        year: 2015,
        fuel: "Naftë",
        passengers: 5,
        transmission: "auto",
        luggage: 4,
        price: null,
        image: "/static/images/mercedes-ml350-2015.jpg",
        features: ["Klimë", "Sensorë Parkimi", "Kamera Parkimi"]
    },
    {
        id: "vw-golf6-2012",
        name: "Volkswagen Golf 6",
        type: "ekonomik",
        year: 2012,
        fuel: "Naftë",
        passengers: 5,
        transmission: "auto",
        luggage: 2,
        price: null,
        image: "/static/images/vw-golf6-2012.jpg",
        features: ["Klimë", "Bluetooth"]
    },
    {
        id: "vw-golf7-2016",
        name: "Volkswagen Golf 7",
        type: "ekonomik",
        year: 2016,
        fuel: "Naftë",
        passengers: 5,
        transmission: "auto",
        luggage: 2,
        price: null,
        image: "/static/images/vw-golf7-2016.jpg",
        features: ["Klimë", "Bluetooth", "Sensorë Parkimi"]
    },
    {
        id: "audi-a4-2014",
        name: "Audi A4",
        type: "luksoz",
        year: 2014,
        fuel: "Naftë",
        passengers: 5,
        transmission: "auto",
        luggage: 3,
        price: null,
        image: "/static/images/audi-a4-2014.jpg",
        features: ["Klimë", "Bluetooth", "Navigacion"]
    }
];

const CONTACT = {
    phone:    "+355699438569",
    whatsapp: "355699438569",
    email:    "dishiarlindo@gmail.com"
};

/* Feature translations (keys match Albanian source) */
const FEATURE_MAP = {
    en: { "Klimë": "A/C", "Kamera Parkimi": "Parking Cam", "Navigacion": "Navigation", "Sensorë Parkimi": "Parking Sensors" },
    de: { "Klimë": "Klima", "Kamera Parkimi": "Parkkamera", "Navigacion": "Navigation", "Sensorë Parkimi": "Parksensoren" }
};

let activeFilter = "";

function t(key) {
    return (window.I18N && window.I18N[key]) ? window.I18N[key] : key;
}

function translateFeatures(features) {
    const lang = window.LANG || "sq";
    const map  = FEATURE_MAP[lang] || {};
    return features.map(f => map[f] || f).join(", ");
}

function renderCars() {
    const grid = document.getElementById("cars-grid");
    if (!grid) return;

    const list = activeFilter ? CARS.filter(c => c.type === activeFilter) : CARS;

    if (list.length === 0) {
        grid.innerHTML = `<p class="no-results">${t("no_cars_found")}</p>`;
        return;
    }

    grid.innerHTML = list.map(car => {
        const waMsg      = encodeURIComponent(`Interesohem për ${car.name} (${car.year}).`);
        const emailSub   = encodeURIComponent(`Interes për ${car.name}`);
        const emailBody  = encodeURIComponent(`Përshëndetje,\nJam i/e interesuar për ${car.name} (${car.year}).`);
        const priceLabel = typeof car.price === "number"
            ? `${car.price}€ / ${t("per_day")}`
            : t("price_on_request");
        const transmission = car.transmission === "auto"
            ? t("transmission_auto")
            : t("transmission_manual");

        return `
        <article class="car-card" data-type="${car.type}">
            <img class="car-img"
                 src="${car.image}"
                 alt="${car.name} (${car.year})"
                 loading="lazy"
                 onerror="this.outerHTML='<div class=\\'car-img-placeholder\\'>🚗</div>'">
            <div class="car-details">
                <h3>${car.name} (${car.year})</h3>
                <div class="car-specs">
                    <span class="spec-chip"><i class="fas fa-users"></i> ${car.passengers}</span>
                    <span class="spec-chip"><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
                    <span class="spec-chip"><i class="fas fa-cog"></i> ${transmission}</span>
                    <span class="spec-chip"><i class="fas fa-suitcase"></i> ${car.luggage}</span>
                </div>
                <p class="car-features"><strong>${t("car_features")}:</strong> ${translateFeatures(car.features)}</p>
                <p class="car-price">${priceLabel}</p>
                <div class="car-actions">
                    <a href="tel:${CONTACT.phone}" class="car-btn car-btn-phone">
                        <i class="fas fa-phone"></i> ${t("call_us")}
                    </a>
                    <a href="https://wa.me/${CONTACT.whatsapp}?text=${waMsg}"
                       class="car-btn car-btn-whatsapp" target="_blank" rel="noopener">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <a href="mailto:${CONTACT.email}?subject=${emailSub}&body=${emailBody}"
                       class="car-btn car-btn-email">
                        <i class="fas fa-envelope"></i> ${t("email_us")}
                    </a>
                </div>
            </div>
        </article>`;
    }).join("");
}

/* Expose so ui.js can trigger re-render on lang switch */
window.renderCars = renderCars;

document.addEventListener("DOMContentLoaded", () => {
    renderCars();

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeFilter = btn.dataset.type || "";
            renderCars();
        });
    });
});
