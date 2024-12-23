// cookie-tracker.js
function setCookie(name, value, daysToExpire) {
  const date = new Date();
  date.setDate(date.getDate() + daysToExpire);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
  console.log(`Cookie set: ${name}=${value}`); // Add this line
}

function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let cookie of cookieArray) {
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

// Track visitor information
function trackVisit() {
  // Get or create visitor ID
  let visitorId = getCookie("visitor_id");
  if (!visitorId) {
    visitorId = "v_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    setCookie("visitor_id", visitorId, 365); // Cookie expires in 1 year
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

// Display tracking information
function displayTrackingInfo() {
  const visitorInfo = trackVisit();
  const sourceInfo = trackSource(); // Add this line

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
