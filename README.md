# 🚗 CarRental

Modern multilingual car rental website built with **Flask + Jinja2**.  
Languages live in JSON files — no code changes needed to add a new one.

---

## Project Structure

```
CarRental/
├── app.py                    # Flask app — all routes here
├── requirements.txt
├── Procfile                  # Heroku / Render / Railway
├── translations/
│   ├── sq.json               # Albanian (default)
│   ├── en.json               # English
│   └── de.json               # German
├── templates/
│   ├── base.html             # Shared layout (head, scripts, header/footer includes)
│   ├── index.html            # Main page content
│   ├── thanks.html           # Post-form confirmation
│   └── partials/
│       ├── header.html       # Sticky header + nav + lang switcher
│       └── footer.html       # Footer
└── static/
    ├── css/
    │   ├── base.css          # Reset, variables, global, buttons
    │   ├── header.css        # Header, nav, lang switcher, footer
    │   ├── sections.css      # Hero, locations, about, contact
    │   ├── cards.css         # Car grid + car cards
    │   └── responsive.css    # All media queries (one place)
    ├── js/
    │   ├── cars.js           # Car data + grid rendering
    │   ├── ui.js             # Mobile menu, lang switch, form validation
    │   └── map.js            # Leaflet map
    └── images/               # Car photos (name matches cars.js `image` field)
```

---

## Run locally

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://localhost:5000

---

## Adding a language

1. Copy `translations/en.json` to `translations/it.json` (or any ISO code).
2. Translate every value — keep the keys unchanged.
3. Restart Flask.

The language button appears automatically — no other changes needed.

---

## Adding a car

In `static/js/cars.js`, add an object to the `CARS` array:

```js
{
    id: "bmw-x5-2020",
    name: "BMW X5",
    type: "suv",           // ekonomik | familjar | luksoz | suv
    year: 2020,
    fuel: "Naftë",
    passengers: 5,
    transmission: "auto",  // "auto" or "manual"
    luggage: 4,
    price: 85,             // number, or null → "Contact us"
    image: "/static/images/bmw-x5-2020.jpg",
    features: ["Klimë", "Navigacion", "Kamera 360"]
}
```

Add the corresponding photo to `static/images/`. Recommended: 800×500px JPEG.

---

## Deploy to Render (free tier)

1. Push to GitHub.
2. Go to https://render.com → New Web Service → connect your repo.
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app`
5. Set environment variable: `SECRET_KEY=<any-random-string>`
6. Deploy.

## Deploy to Railway

```bash
railway login
railway init
railway up
```

Set `SECRET_KEY` in Railway's environment variables dashboard.

---

## Routes

| Route | Description |
|---|---|
| `GET /` | Main page (language from session, default: Albanian) |
| `GET /set-lang/<code>` | Set language in session, redirect to `/` |
| `GET /thanks` | Post-form thank-you page |
| `GET /api/translations/<code>` | Returns full translation JSON (used by JS) |
| `GET /api/languages` | Returns `{code: lang_name}` dict of available languages |
