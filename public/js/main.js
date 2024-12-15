function getCityFromTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone.split("/").pop().replace(/_/g, " ");
}

function updateTimeDisplay() {
  // Get browser's local time and timezone
  const browserCity = getCityFromTimezone();
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Fetch actual location from Cloudflare
  fetch("/api/visitor-info")
    .then((response) => response.json())
    .then((data) => {
      const resultHtml = `
                <h3>Time Information:</h3>
                <p>Browser Time: ${browserCity} ${currentTime}</p>
                <p>Physical Location: ${data.countryName}</p>
                ${
                  browserCity.includes(data.countryName)
                    ? ""
                    : `<p>Note: Your browser timezone (${browserCity}) appears different from your location (${data.countryName})</p>`
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
