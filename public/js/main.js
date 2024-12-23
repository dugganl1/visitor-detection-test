function getCountryFromTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Get the first part of timezone which is usually the continent/country
  return timezone.split("/")[0];
}

function updateTimeDisplay() {
  const browserCountry = getCountryFromTimezone();
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
        <h3>Time Information:</h3>
        <p>Browser Time: ${currentTime}</p>
        <p>Browser Location: ${browserCountry}</p>
        <p>Physical Location: ${data.countryName || "Unknown"}</p>
        ${
          data.countryName && browserCountry !== data.countryName
            ? `<p>Note: Your browser location (${browserCountry}) appears different from your detected country (${data.countryName})</p>`
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
