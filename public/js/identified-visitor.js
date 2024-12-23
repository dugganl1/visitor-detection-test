function identifyVisitor(email) {
  // Get current anonymous visitor data
  const visitorId = getCookie("visitor_id");
  const sessionId = getCookie("session_id");

  // Create a user identifier (in practice, this would come from your backend)
  const userId = `u_${btoa(email).replace(/[^a-zA-Z0-9]/g, "")}`;

  // Set identified user cookies
  setCookie("user_id", userId, 365); // 1 year
  setCookie("user_email", email, 365);
  setCookie("identified_date", new Date().toISOString(), 365);

  // In practice, you would send this to your backend
  const userData = {
    userId,
    email,
    previousVisitorId: visitorId,
    previousSessionId: sessionId,
    identifiedAt: new Date().toISOString(),
    // Add any other cookie data you want to associate
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

  // In practice, you would:
  // 1. Send userData to your backend
  // 2. Associate it with a user record
  // 3. Trigger your eBook download
  // 4. Maybe send a welcome email

  // For demo, just show what we captured
  const identityHtml = `
        <h3>Identified Visitor Info:</h3>
        <p>User ID: ${userData.userId}</p>
        <p>Email: ${userData.email}</p>
        <p>Previous Visitor ID: ${userData.previousVisitorId}</p>
        <p>Identified At: ${new Date(userData.identifiedAt).toLocaleString()}</p>
        <p>Visit Count Before Identification: ${userData.visitCount}</p>
    `;

  document.getElementById("result").innerHTML += identityHtml;

  // Hide the form after submission
  document.querySelector(".form-container").style.display = "none";
});
