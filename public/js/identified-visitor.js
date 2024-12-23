// identified-visitor.js
function identifyVisitor(email) {
  // Get current anonymous visitor data
  const visitorId = getCookie("visitor_id");
  const sessionId = getCookie("session_id");

  // Create a user identifier
  const userId = `u_${btoa(email).replace(/[^a-zA-Z0-9]/g, "")}`;

  // Get or initialize known visitor IDs array
  let knownVisitorIds = getCookie("known_visitor_ids");
  try {
    knownVisitorIds = knownVisitorIds ? JSON.parse(knownVisitorIds) : [];
  } catch (e) {
    console.error("Error parsing known_visitor_ids cookie:", e);
    knownVisitorIds = [];
  }

  // Add current visitor ID if it's new
  if (!knownVisitorIds.includes(visitorId)) {
    knownVisitorIds.push(visitorId);
    setCookie("known_visitor_ids", JSON.stringify(knownVisitorIds), 365);
  }

  // Set identified user cookies
  setCookie("user_id", userId, 365);
  setCookie("user_email", email, 365);
  setCookie("identified_date", new Date().toISOString(), 365);

  const userData = {
    userId,
    email,
    currentVisitorId: visitorId,
    currentSessionId: sessionId,
    allKnownVisitorIds: knownVisitorIds,
    identifiedAt: new Date().toISOString(),
    visitCount: getCookie("visit_count"),
    firstVisit: getCookie("first_visit"),
  };

  console.log("User identified:", userData);
  return userData;
}

// Add form submission handler
document.getElementById("ebook-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const userData = identifyVisitor(email);

  const identityHtml = `
        <h3>Identified Visitor Info:</h3>
        <p>User ID: ${userData.userId}</p>
        <p>Email: ${userData.email}</p>
        <p>Current Visitor ID: ${userData.currentVisitorId}</p>
        <p>All Known Visitor IDs (${userData.allKnownVisitorIds.length}): 
           ${userData.allKnownVisitorIds.join(", ")}</p>
        <p>Identified At: ${new Date(userData.identifiedAt).toLocaleString()}</p>
        <p>Visit Count (Current Browser): ${userData.visitCount}</p>
    `;

  document.getElementById("result").innerHTML += identityHtml;

  // Hide the form after submission
  document.querySelector(".form-container").style.display = "none";
});
