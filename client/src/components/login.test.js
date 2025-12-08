// login.test.js
// Automated logic tests for BDMS Login (no React needed)

// ========== MINI TEST FRAMEWORK ===============

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`${totalTests}) PASS - ${name}`);
  } catch (err) {
    console.log(`${totalTests}) FAIL - ${name}`);
    console.log("   →", err.message);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      (message || "Values are not equal") +
        ` (expected: ${expected}, got: ${actual})`
    );
  }
}

// ========== LOGIC UNDER TEST ==================

// This matches your BDMS Login handleSubmit validation logic,
// but instead of alert() it RETURNS the error message (or null if OK).
function validateLoginInput(emailRaw, password) {
  const email = emailRaw.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return "Please enter your email address.";
  }

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  if (!password) {
    return "Please enter your password.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  // ✅ No validation error
  return null;
}

// This matches your useEffect redirection logic:
//
// if (!user.isVerified) alert("Please verify...")
// if (user.isAdmin) -> /reports
// else if (user.isHospital) -> /hospital-dash
// else -> /home
//
// Here we return a string instead of calling navigate()/alert().
function getRedirectAfterLogin(user) {
  if (!user) return null;

  if (!user.isVerified) {
    return "BLOCK: Please verify your email before logging in.";
  }

  if (user.isAdmin === true) return "/reports";
  if (user.isHospital === true) return "/hospital-dash";
  return "/home";
}

// ========== TEST CASES ========================

// --- Validation tests ---

test("Empty email should show 'Please enter your email address.'", () => {
  const error = validateLoginInput("", "Password123");
  assertEqual(
    error,
    "Please enter your email address.",
    "Did not get expected empty-email error"
  );
});

test("Invalid email format should show 'Please enter a valid email address.'", () => {
  const error = validateLoginInput("invalid-email", "Password123");
  assertEqual(
    error,
    "Please enter a valid email address.",
    "Did not get expected invalid-email error"
  );
});

test("Empty password should show 'Please enter your password.'", () => {
  const error = validateLoginInput("user@example.com", "");
  assertEqual(
    error,
    "Please enter your password.",
    "Did not get expected empty-password error"
  );
});

test("Short password should show 'Password must be at least 8 characters.'", () => {
  const error = validateLoginInput("user@example.com", "short");
  assertEqual(
    error,
    "Password must be at least 8 characters.",
    "Did not get expected short-password error"
  );
});

test("Valid email & password should return null (no error)", () => {
  const error = validateLoginInput("user@example.com", "Password123");
  assertEqual(error, null, "Expected no error for valid credentials");
});

// --- Redirect / role logic tests ---

test("Unverified user should be blocked with verify message", () => {
  const user = {
    isVerified: false,
    isAdmin: false,
    isHospital: false,
  };

  const result = getRedirectAfterLogin(user);
  assertEqual(
    result,
    "BLOCK: Please verify your email before logging in.",
    "Unverified user should be blocked"
  );
});

test("Verified admin user should navigate to /reports", () => {
  const user = {
    isVerified: true,
    isAdmin: true,
    isHospital: false,
  };

  const result = getRedirectAfterLogin(user);
  assertEqual(
    result,
    "/reports",
    "Admin user did not navigate to /reports"
  );
});

test("Verified hospital user should navigate to /hospital-dash", () => {
  const user = {
    isVerified: true,
    isAdmin: false,
    isHospital: true,
  };

  const result = getRedirectAfterLogin(user);
  assertEqual(
    result,
    "/hospital-dash",
    "Hospital user did not navigate to /hospital-dash"
  );
});

test("Verified normal donor should navigate to /home", () => {
  const user = {
    isVerified: true,
    isAdmin: false,
    isHospital: false,
  };

  const result = getRedirectAfterLogin(user);
  assertEqual(result, "/home", "Donor did not navigate to /home");
});

// ========== SUMMARY OUTPUT ====================

console.log("\n========================");
console.log(`Result: ${passedTests}/${totalTests} tests passed`);
if (passedTests === totalTests) {
  console.log("ALL TESTS PASSED");
} else {
  console.log("SOME TESTS FAILED");
}
console.log("========================\n");
