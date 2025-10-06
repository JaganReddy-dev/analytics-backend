// ============================================
// Core Configuration
// ============================================
const CONFIG = {
  BASE_URL: "http://localhost:4000/collect",
  SCROLL_CHECKPOINTS: [25, 50, 75, 100],
  SCROLL_THROTTLE_MS: 500,
};

// ============================================
// API Client
// ============================================
console.log("currently monitoring");
const api = {
  send(endpoint, payload) {
    const url = `${CONFIG.BASE_URL}/${endpoint}`;

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        url,
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("Tracking error:", err));
    }
  },

  trackEvent(type, action, metadata = {}) {
    this.send("event", {
      type,
      action,
      website: window.location.href,
      metadata,
    });
  },

  trackVisitor(visitorData) {
    this.send("visitor", visitorData);
  },
};

// ============================================
// Visitor Information Collector
// ============================================

const visitorCollector = {
  collect() {
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      referrer: document.referrer || "direct",
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
  },
};

// ============================================
// Click Tracking Module
// ============================================
const clickTracker = {
  trackables: [
    { attr: "trackify-navigate", type: "navigation-click" },
    { attr: "trackify-button", type: "button-click" },
  ],

  init() {
    document.addEventListener("click", this.handleClick.bind(this));
  },

  handleClick(e) {
    for (const t of this.trackables) {
      const target = e.target.closest(`[${t.attr}]`);
      if (target) {
        const action = target.getAttribute(t.attr);
        api.trackEvent(t.type, action, { element: t.attr });
        break;
      }
    }
  },
};

// ============================================
// Scroll Tracking Module
// ============================================
const scrollTracker = {
  reached: new Set(),

  init() {
    window.addEventListener(
      "scroll",
      this.throttle(this.handleScroll.bind(this), CONFIG.SCROLL_THROTTLE_MS)
    );
  },

  getScrollPercent() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    return Math.round((scrollTop / docHeight) * 100);
  },

  handleScroll() {
    const percent = this.getScrollPercent();

    for (let checkpoint of CONFIG.SCROLL_CHECKPOINTS) {
      if (percent >= checkpoint && !this.reached.has(checkpoint)) {
        this.reached.add(checkpoint);
        api.trackEvent("scroll-depth", "scroll", { depth: checkpoint });
      }
    }
  },

  throttle(fn, delay) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn(...args);
      }
    };
  },
};

// ============================================
// Location Tracking Module
// ============================================

const locationTracker = {
  init() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      this.handleSuccess.bind(this),
      this.handleError.bind(this)
    );
  },

  handleSuccess(pos) {
    api.trackEvent("location", "geolocation", {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    });
  },

  handleError() {
    api.trackEvent("location", "ip_fallback");
  },
};

// ============================================
// Main Tracker Initialization
// ============================================
const Trackify = {
  init() {
    // Track visitor
    api.trackVisitor(visitorCollector.collect());

    // Track initial pageview
    api.trackEvent("pageview", "page_load");

    // Initialize all trackers
    clickTracker.init();
    scrollTracker.init();
    locationTracker.init();
  },
};

// Auto-initialize
(() => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => Trackify.init());
  } else {
    Trackify.init();
  }
})();
