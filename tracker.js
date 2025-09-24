(() => {
  const BASE_URL = "http://localhost:4000/collect";

  const getVisitorInfo = () => {
    const deviceType = () =>
      /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
        ? "Mobile"
        : "Desktop";
    return {
      url: window.location.href,
      device: deviceType(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
  };

  const sendPayload = (endpoint, payload) => {
    const API_URL = `${BASE_URL}/${endpoint}`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API_URL, JSON.stringify(payload));
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error(err.error);
      });
    }
  };

  sendPayload("visitor", getVisitorInfo());

  const sendEvent = (type, extraData = {}) => {
    sendPayload({
      type,
      website: window.location.hostname,
      ...getVisitorInfo(),
      ...extraData,
    });
  };

  sendEvent("pageview");

  document.addEventListener("click", (e) => {
    sendEvent("click", {
      tag: e.target.tagName,
      id: e.target.id,
      classes: e.target.className,
    });
  });
})();
