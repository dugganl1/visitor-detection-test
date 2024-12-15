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
                <h3>Time Information:</h3>
                <p>Browser Time: ${browserCity} ${currentTime}</p>
                <p>Physical Location: ${data.city}, ${data.countryName}</p>
                ${
                  data.city && browserCity !== data.city
                    ? `<p>Note: Your browser timezone (${browserCity}) appears different from your detected city (${data.city})</p>`
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
