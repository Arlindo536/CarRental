"""
CarRental – Flask app
---------------------
Routes:
  GET  /                      → serve index, inject translations server-side
  GET  /thanks                → thank-you page after form submission
  GET  /api/translations/<lang> → return full translation JSON for a language
  GET  /api/languages         → return list of available languages

Adding a language: drop a new JSON file in translations/ and restart.
"""

import json
import os
from pathlib import Path
from flask import Flask, render_template, jsonify, session, redirect, url_for, abort

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")

TRANSLATIONS_DIR = Path(__file__).parent / "translations"
DEFAULT_LANG = "sq"


# ── helpers ────────────────────────────────────────────────────────────────────

def get_available_languages() -> dict[str, str]:
    """Return {code: lang_name} for every JSON file in translations/."""
    langs = {}
    for f in sorted(TRANSLATIONS_DIR.glob("*.json")):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            langs[f.stem] = data.get("lang_name", f.stem.upper())
        except (json.JSONDecodeError, OSError):
            pass
    return langs


def load_translation(lang_code: str) -> dict:
    """Load and return translations for a given language code."""
    path = TRANSLATIONS_DIR / f"{lang_code}.json"
    if not path.exists():
        path = TRANSLATIONS_DIR / f"{DEFAULT_LANG}.json"
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


# ── routes ─────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    lang = session.get("lang", DEFAULT_LANG)
    t    = load_translation(lang)
    available = get_available_languages()
    return render_template("index.html", t=t, lang=lang, available_langs=available)


@app.route("/set-lang/<lang_code>")
def set_lang(lang_code):
    """Store the chosen language in session and redirect back to home."""
    if (TRANSLATIONS_DIR / f"{lang_code}.json").exists():
        session["lang"] = lang_code
    return redirect(url_for("index"))


@app.route("/thanks")
def thanks():
    lang = session.get("lang", DEFAULT_LANG)
    t    = load_translation(lang)
    return render_template("thanks.html", t=t, lang=lang)


# ── API endpoints (used by JS for client-side language switching) ───────────────

@app.route("/api/translations/<lang_code>")
def api_translations(lang_code):
    path = TRANSLATIONS_DIR / f"{lang_code}.json"
    if not path.exists():
        abort(404)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return jsonify(data)
    except (json.JSONDecodeError, OSError):
        abort(500)


@app.route("/api/languages")
def api_languages():
    return jsonify(get_available_languages())


# ── run ────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    app.run(debug=debug, host="0.0.0.0", port=5000)
