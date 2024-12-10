document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/visitor-info")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("result").innerHTML = `<h3>Detected Information:</h3>
                 <pre>${JSON.stringify(data, null, 2)}</pre>`;
    })
    .catch((error) => {
      document.getElementById("result").innerHTML = "Error loading visitor information.";
    });
});
