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
    console.log(API_URL);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        API_URL,
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error(e);
      });
    }
  };

  sendPayload("visitor", getVisitorInfo());

  const sendEvent = (endpoint, type, extraData = {}) => {
    sendPayload(endpoint, {
      type,
      website: window.location.href,
      ...getVisitorInfo(),
      ...extraData,
    });
  };

  sendEvent("event", "pageview");

  document.addEventListener("click", (e) => {
    sendEvent("event", "click", {
      tag: e.target.tagName,
      id: e.target.id,
      classes: e.target.className,
    });
  });
})();
