// In main.js
let visitorData = null; // Store the Cloudflare data

function getCountryFromTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Get the first part of timezone which is usually the continent/country
  return timezone.split("/")[0];
}

function updateTimeDisplay() {
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  if (!visitorData) {
    // Don't update the display until we have the data
    return;
  }

  const browserCountry = getCountryFromTimezone();
  const resultHtml = `
    <h3>Time Information:</h3>
    <p>Browser Time: ${currentTime}</p>
    <p>Browser Location: ${browserCountry}</p>
    <p>Physical Location: ${visitorData.countryName || "Unknown"}</p>
    ${
      visitorData.countryName && browserCountry !== visitorData.countryName
        ? `<p>Note: Your browser location (${browserCountry}) appears different from your detected country (${visitorData.countryName})</p>`
        : ""
    }
  `;
  document.getElementById("result").innerHTML = resultHtml;
}

// Fetch location data once when page loads
function fetchVisitorInfo() {
  fetch("/api/visitor-info")
    .then((response) => response.json())
    .then((data) => {
      visitorData = data;
      updateTimeDisplay(); // Initial display update
    })
    .catch((error) => {
      document.getElementById(
        "result"
      ).innerHTML = `Error loading location information: ${error.message}`;
    });
}

// Start the clock updates
setInterval(updateTimeDisplay, 1000);

// Fetch the location data once on page load
fetchVisitorInfo();
