// source-tracker.js
function trackSource() {
  const referrer = document.referrer;

  // Only set initial source if it's the first visit ever
  if (!getCookie("initial_source") && !getCookie("first_visit")) {
    setCookie("initial_source", referrer || "Direct", 365);
  }

  // Get the stored initial source
  const initialSource = getCookie("initial_source") || "Direct";

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
    initialSource,
    currentReferrer: referrer || "Direct",
    ...utmParams,
  };
}
