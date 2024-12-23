// cookie-tracker.js
function trackVisit() {
  // Get or create visitor ID
  let visitorId = getCookie("visitor_id");
  if (!visitorId) {
    visitorId = "v_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    setCookie("visitor_id", visitorId, 365);
  }

  // Track visit count
  let visitCount = parseInt(getCookie("visit_count")) || 0;
  setCookie("visit_count", visitCount + 1, 365);

  // Track first visit date
  let firstVisit = getCookie("first_visit");
  if (!firstVisit) {
    firstVisit = new Date().toISOString();
    setCookie("first_visit", firstVisit, 365);
  }

  // Track last visit date
  setCookie("last_visit", new Date().toISOString(), 365);

  return {
    visitorId,
    visitCount: visitCount + 1,
    firstVisit,
    lastVisit: new Date().toISOString(),
  };
}

function displayTrackingInfo() {
  const visitorInfo = trackVisit();
  const sourceInfo = trackSource();

  const resultHtml = `
        <h3>Cookie Tracking Info:</h3>
        <p>Visitor ID: ${visitorInfo.visitorId}</p>
        <p>Visit Count: ${visitorInfo.visitCount}</p>
        <p>First Visit: ${new Date(visitorInfo.firstVisit).toLocaleString()}</p>
        <p>Last Visit: ${new Date(visitorInfo.lastVisit).toLocaleString()}</p>
        
        <h3>Attribution Info:</h3>
        <p>Initial Source: ${sourceInfo.initialSource}</p>
        <p>Current Referrer: ${sourceInfo.referrer || "Direct"}</p>
        ${
          sourceInfo.source
            ? `
        <p>Campaign Source: ${sourceInfo.source}</p>
        <p>Campaign Medium: ${sourceInfo.medium || "Not Set"}</p>
        <p>Campaign Name: ${sourceInfo.campaign || "Not Set"}</p>
        `
            : ""
        }
    `;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML += resultHtml;
}
