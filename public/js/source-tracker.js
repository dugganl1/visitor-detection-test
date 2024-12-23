// source-tracker.js
function trackSource() {
  const referrer = document.referrer;
  const source = getCookie("initial_source") || referrer;

  // Only set initial source for new visitors
  if (!getCookie("initial_source")) {
    setCookie("initial_source", source, 365);
  }

  // UTM tracking
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    source: urlParams.get("utm_source"),
    medium: urlParams.get("utm_medium"),
    campaign: urlParams.get("utm_campaign"),
  };

  // Store UTM params if present
  if (utmParams.source) {
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) setCookie(`utm_${key}`, value, 365);
    });
  }

  return {
    referrer,
    initialSource: source || "Direct",
    ...utmParams,
  };
}
