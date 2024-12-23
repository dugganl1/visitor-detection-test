function displayVisitorInfo() {
  fetch("/api/visitor-info")
    .then((response) => response.json())
    .then((data) => {
      const resultHtml = `
        <h3>IP Analytics:</h3>
        <p>IP Address: ${data.ip}</p>
        <p>Country: ${data.countryName || "Unknown"}</p>
        <p>Network: ${data.org || "Unknown"}</p>
        <p>ASN: ${data.asn?.asn || "Unknown"}</p>
        <p>Hostname: ${data.hostname || "Unknown"}</p>
        ${data.privacy?.vpn ? "<p><strong>VPN Detected</strong></p>" : ""}
      `;
      document.getElementById("result").innerHTML = resultHtml;
    })
    .catch((error) => {
      document.getElementById(
        "result"
      ).innerHTML = `Error loading visitor information: ${error.message}`;
    });
}

// Single API call on page load
displayVisitorInfo();
