(() => {
  const CONFIG = {
    BASE_URL: "http://localhost:4000/collect",
    SCROLL_CHECKPOINTS: [25, 50, 75, 100],
    SCROLL_THROTTLE_MS: 500,
    SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 min
  };

  // --- Session & User Management ---
  const generateSessionId = () => {
    const id = crypto.randomUUID();
    localStorage.setItem("sessionId", id);
    localStorage.setItem("lastActive", Date.now().toString());
    return id;
  };

  const getSessionId = () => {
    const id = localStorage.getItem("sessionId");
    const lastActive = Number(localStorage.getItem("lastActive"));
    if (
      !id ||
      !lastActive ||
      Date.now() - lastActive >= CONFIG.SESSION_TIMEOUT_MS
    ) {
      return generateSessionId();
    }
    return id;
  };

  const generateUserId = () => {
    const id = crypto.randomUUID();
    localStorage.setItem("userId", id);
    return id;
  };

  const updateActivity = () => {
    localStorage.setItem("lastActive", Date.now().toString());
  };

  let sessionId = getSessionId();
  let userId = localStorage.getItem("userId") || generateUserId();
  let isBrave = false;

  const reached = new Set();
  let userLocation = null;

  const sendData = (endpoint, payload) => {
    updateActivity();
    const url = `${CONFIG.BASE_URL}/${endpoint}`;

    const data = {
      ...payload,
      sessionId,
      userId,
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        url,
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch((err) => console.error("Tracking error:", err));
    }
  };

  const trackEvent = (type, action, metadata = {}) => {
    sendData("event", {
      type,
      action,
      website: window.location.href,
      metadata,
    });
  };

  const checkBrave = async () => {
    if (navigator.brave && navigator.brave.isBrave) {
      return await navigator.brave.isBrave();
    }
    return false;
  };

  const visitorCollector = () => ({
    url: window.location.href,
    userAgent: navigator.userAgent,
    referrer: document.referrer || "direct",
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    isBrave: isBrave,
  });

  const trackables = [
    { attr: "trackify-navigate", type: "navigation-click" },
    { attr: "trackify-button", type: "button-click" },
  ];

  const handleClick = (e) => {
    for (const t of trackables) {
      const target = e.target.closest(`[${t.attr}]`);
      if (target) {
        const action = target.getAttribute(t.attr);
        trackEvent(t.type, action, { element: t.attr });
        break;
      }
    }
  };

  const clickTracker = () => document.addEventListener("click", handleClick);

  const scrollTracker = () => {
    const getScrollPercent = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      return Math.round((scrollTop / docHeight) * 100);
    };

    const handleScroll = () => {
      const percent = getScrollPercent();
      for (let checkpoint of CONFIG.SCROLL_CHECKPOINTS) {
        if (percent >= checkpoint && !reached.has(checkpoint)) {
          reached.add(checkpoint);
          trackEvent("scroll-depth", "scroll", { depth: checkpoint });
        }
      }
    };

    const throttle = (fn, delay) => {
      let last = 0;
      return (...args) => {
        const now = Date.now();
        if (now - last >= delay) {
          last = now;
          fn(...args);
        }
      };
    };

    window.addEventListener(
      "scroll",
      throttle(handleScroll, CONFIG.SCROLL_THROTTLE_MS)
    );
  };

  const pageViewCollector = () => ({
    sessionId: sessionId,
    userId: userId,
    url: window.location.href,
  });

  const locationTracker = (callback) => {
    if (!navigator.geolocation) {
      callback();
      return;
    }
    const handleSuccess = (pos) => {
      userLocation = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      };
      callback();
    };

    const handleError = () => {
      trackEvent("location", "ip_fallback");
      callback();
    };
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  };

  const init = async () => {
    isBrave = await checkBrave();
    clickTracker();
    scrollTracker();
    locationTracker(() => {
      sendData("pageview", pageViewCollector());
      sendData("visitor", visitorCollector());
    });
  };

  document.addEventListener("DOMContentLoaded", init);
})();
