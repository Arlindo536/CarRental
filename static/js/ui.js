/* ============================================================
   ui.js  –  Mobile menu, client-side lang switch, form validation
   ============================================================ */

/* ── Mobile menu ──────────────────────────────────────────── */
function setupMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav    = document.getElementById("main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
    });

    /* Close when a nav link is tapped */
    nav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", false);
        });
    });
}

/* ── Client-side language switch (no page reload) ────────── */
/*
   The server already rendered the page with the correct language.
   Clicking a lang button here:
     1. Fetches the new translations from /api/translations/<lang>
     2. Updates window.I18N + window.LANG
     3. Re-renders the car grid (only dynamic content)
     4. Updates the active button state
     5. Updates the <html lang> attribute

   Static text on the page (nav, sections, footer) is server-rendered
   and gets updated by a soft page reload via history.pushState +
   a lightweight fetch of the new page's content — OR simply by
   following the /set-lang/<code> server link, which is the fallback.

   For this project the simplest approach: clicking lang buttons
   navigates to /set-lang/<code> (works without JS) and JS
   intercepts to do it without a full reload via fetch.
*/
async function setupLangSwitcher() {
    const btns = document.querySelectorAll(".lang-btn");
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener("click", async e => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            if (lang === window.LANG) return;

            try {
                const res  = await fetch(`/api/translations/${lang}`);
                if (!res.ok) throw new Error("fetch failed");
                window.I18N  = await res.json();
                window.LANG  = lang;

                /* Update html lang */
                document.documentElement.lang = lang;

                /* Re-render dynamic car grid */
                if (typeof window.renderCars === "function") window.renderCars();

                /* Update active state */
                btns.forEach(b => b.classList.toggle("active", b.dataset.lang === lang));

                /* Persist via server session in background */
                fetch(`/set-lang/${lang}`);

            } catch (err) {
                /* Fallback: follow the server link normally */
                window.location.href = btn.href;
            }
        });
    });
}

/* ── Contact form validation ──────────────────────────────── */
function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", e => {
        const required = ["name", "email", "message"];
        for (const id of required) {
            const el = document.getElementById(id);
            if (!el || !el.value.trim()) {
                e.preventDefault();
                el?.focus();
                const msg = (window.I18N && window.I18N.form_required) || "Please fill all fields.";
                alert(msg);
                return;
            }
        }
    });
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupLangSwitcher();
    setupContactForm();
});
