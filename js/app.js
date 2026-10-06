// =========================================================
// The Green Banana — site behavior
// =========================================================

// ---- CONFIG: fill these in as your business goes live ----

// 1) Once you create Stripe Payment Links (see README.md), paste each
//    link's URL here. Leave a plan's value as "" to keep it pointed at
//    the waitlist form instead of a live checkout.
const STRIPE_LINKS = {
  "Study Pack": "",
  "Family Pack": ""
};

// 2) Where waitlist signups get sent. Defaults to a mailto: link so this
//    works with zero setup. Swap to a Formspree (or similar) endpoint
//    for a nicer inline confirmation — see README.md.
const CONTACT_EMAIL = "milo@balibread.com";
const FORMSPREE_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

// 3) Delivery zip codes for launch. Edit freely as your service area grows.
const DELIVERY_ZIPS = [
  "93117", // Isla Vista / Goleta
  "93111", // Goleta
  "93101", "93103", "93105", "93108", "93109", "93110" // Santa Barbara
];

// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initZipChecker();
  initPlanButtons();
  initSignupForm();
  document.getElementById("year").textContent = new Date().getFullYear();
  registerServiceWorker();
});

function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initZipChecker() {
  const form = document.getElementById("zipForm");
  const input = document.getElementById("zipInput");
  const result = document.getElementById("zipResult");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const zip = input.value.trim();
    if (!/^\d{5}$/.test(zip)) {
      result.textContent = "Please enter a valid 5-digit zip code.";
      result.className = "zip-result is-no";
      return;
    }
    if (DELIVERY_ZIPS.includes(zip)) {
      result.textContent = "Good news — we deliver (and offer pickup) in your area.";
      result.className = "zip-result is-yes";
    } else {
      result.textContent = "We don't deliver there yet, but pickup may still work — join the waitlist and tell us your area.";
      result.className = "zip-result is-no";
    }
  });
}

function initPlanButtons() {
  const buttons = document.querySelectorAll(".plan-btn");
  const note = document.getElementById("checkoutNote");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const planName = btn.getAttribute("data-plan-name");
      const stripeLink = STRIPE_LINKS[planName];

      if (stripeLink) {
        // Real checkout is configured for this plan — send them straight there.
        window.open(stripeLink, "_blank", "noopener");
        return;
      }

      // No live checkout yet — pre-fill and scroll to the waitlist form.
      const planSelect = document.getElementById("planSelect");
      if (planSelect) {
        const match = Array.from(planSelect.options).find(o => o.value === planName);
        if (match) planSelect.value = planName;
      }
      if (note) {
        note.textContent = `Online checkout for "${planName}" isn't live yet — join the waitlist below and we'll follow up.`;
      }
      document.getElementById("signup").scrollIntoView({ behavior: "smooth" });
      document.getElementById("nameInput")?.focus();
    });
  });
}

function initSignupForm() {
  const form = document.getElementById("signupForm");
  const status = document.getElementById("signupStatus");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (FORMSPREE_ENDPOINT) {
      try {
        status.textContent = "Sending...";
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        });
        if (res.ok) {
          status.textContent = "You're on the list! We'll be in touch soon.";
          form.reset();
        } else {
          status.textContent = "Something went wrong — please email us directly at " + CONTACT_EMAIL + ".";
        }
      } catch {
        status.textContent = "Something went wrong — please email us directly at " + CONTACT_EMAIL + ".";
      }
      return;
    }

    // Zero-setup fallback: open a pre-filled email to the business.
    const subject = encodeURIComponent("New waitlist signup — The Green Banana");
    const body = encodeURIComponent(
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone || "—"}\n` +
      `Zip code: ${data.zip}\n` +
      `Delivery or pickup: ${data.fulfillment}\n` +
      `Plan interested in: ${data.plan}\n` +
      `Notes: ${data.notes || "—"}\n`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    status.textContent = "Opening your email app to send this to us — thanks for signing up!";
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      /* non-fatal: site still works fully without offline support */
    });
  }
}
