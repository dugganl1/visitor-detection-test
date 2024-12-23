function getCityFromTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone.split("/").pop().replace(/_/g, " ");
}

function updateTimeDisplay() {
  const browserCity = getCityFromTimezone();
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  fetch("/api/visitor-info")
    .then((response) => response.json())
    .then((data) => {
      const resultHtml = `
        <h3>Browser Information:</h3>
        <p>Browser Time: ${browserCity} ${currentTime}</p>
        
        <h3>Cloudflare Detection:</h3>
        <ul>
          <li>IP Address: ${data.ip || "Not detected"}</li>
          <li>City: ${data.city || "Not detected"}</li>
          <li>Region: ${data.region || "Not detected"}</li>
          <li>Country: ${data.countryName || "Not detected"} (${data.country || "N/A"})</li>
          <li>Continent: ${data.continent || "Not detected"}</li>
          <li>Coordinates: ${
            data.latitude ? `${data.latitude}, ${data.longitude}` : "Not detected"
          }</li>
          <li>Timezone: ${data.timezone || "Not detected"}</li>
        </ul>

        ${
          data.city && browserCity !== data.city
            ? `<p class="note">Note: Your browser timezone (${browserCity}) appears different from your detected city (${data.city})</p>`
            : ""
        }
      `;
      document.getElementById("result").innerHTML = resultHtml;
    })
    .catch((error) => {
      document.getElementById(
        "result"
      ).innerHTML = `Error loading location information: ${error.message}`;
    });
}

// Update time every second
setInterval(updateTimeDisplay, 1000);
updateTimeDisplay(); // Initial call
