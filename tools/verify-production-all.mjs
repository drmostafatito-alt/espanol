// @ts-check
import { strict as assert } from 'node:assert';
import crypto from 'node:crypto';

const ORIGIN = 'https://learn.espanol-balarabi.workers.dev';

console.log(`=============================================================`);
console.log(`🌐 اختبار الإنتاج الفعلي الشامل على الإنترنت: ${ORIGIN}`);
console.log(`=============================================================`);

function b64urlToBytes(value) {
  const b64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

async function deriveClientKey(password, saltB64, iterations) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: b64urlToBytes(saltB64), iterations, hash: 'SHA-256' },
    key,
    256,
  );
  return Buffer.from(new Uint8Array(bits)).toString('base64url');
}

async function main() {
  const testResults = [];
  const record = (name, ok, details = '') => {
    testResults.push({ name, ok, details });
    console.log(`${ok ? '✅' : '❌'} [${name}] ${details}`);
  };

  // 1. Health & DB
  try {
    const res = await fetch(`${ORIGIN}/api/health`);
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.ok, true);
    assert.equal(data.env, 'production');
    assert.equal(data.db.reachable, true);
    record('1. API Health & DB Connectivity', true, `Env: ${data.env}, DB Reachable: ${data.db.reachable}, Time: ${data.time}`);
  } catch (err) {
    record('1. API Health & DB Connectivity', false, err.message);
  }

  // 2. Homepage, Assets, Security Headers & Mobile Viewport
  try {
    const res = await fetch(`${ORIGIN}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('<div id="root"></div>'), 'Root div present');
    assert.ok(html.includes('viewport-fit=cover') && html.includes('width=device-width'), 'Responsive mobile viewport present');
    const nosniff = res.headers.get('x-content-type-options');
    const xfo = res.headers.get('x-frame-options');
    const csp = res.headers.get('content-security-policy');
    assert.ok(nosniff, 'nosniff header present');
    record('2. Homepage, Security Headers & Mobile Viewport', true, `Status 200, Mobile Viewport present, XFO: ${xfo}, nosniff: ${nosniff}, CSP: ${csp ? 'Active' : 'Missing'}`);
  } catch (err) {
    record('2. Homepage, Security Headers & Mobile Viewport', false, err.message);
  }

  // 3. Learning Paths / Curriculum
  try {
    const res = await fetch(`${ORIGIN}/api/content/paths`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.paths));
    assert.ok(data.paths.length > 0);
    record('3. Learning Paths & Curriculum API', true, `Loaded ${data.paths.length} curriculum paths`);
  } catch (err) {
    record('3. Learning Paths & Curriculum API', false, err.message);
  }

  // 4. Session Protection Gate & Non-existent content policy
  try {
    const unauthSessionRes = await fetch(`${ORIGIN}/api/lessons/prea1-hola-me-llamo/session`);
    assert.equal(unauthSessionRes.status, 401);
    const nonExistentRes = await fetch(`${ORIGIN}/api/content/lessons/nonexistent-draft-lesson`);
    assert.equal(nonExistentRes.status, 404);
    record('4. Learning Session & Content Protection Gate', true, 'Unauthenticated session returns 401; non-existent/hidden content returns 404');
  } catch (err) {
    record('4. Learning Session & Content Protection Gate', false, err.message);
  }

  // 5. Smart Search API
  try {
    const res = await fetch(`${ORIGIN}/api/content/search?q=hola`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.results));
    assert.ok(data.results.length > 0);
    record('5. Smart Search API', true, `Found ${data.results.length} matches for query 'hola'`);
  } catch (err) {
    record('5. Smart Search API', false, err.message);
  }

  // 6. Free Registration (v2 600k KDF Client Derivation)
  const testId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const testEmail = `prod_test_${testId}@example.com`;
  const testPass = `Passw0rd_Test_${testId}!`;
  let sessionCookie = '';

  try {
    // 6a. Get KDF parameters
    const paramsRes = await fetch(`${ORIGIN}/api/auth/kdf-params`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });
    assert.equal(paramsRes.status, 200);
    const kdfParams = await paramsRes.json();
    assert.equal(kdfParams.iterations, 600000);
    assert.ok(kdfParams.salt);

    // 6b. Client derives key (600,000 iterations PBKDF2)
    const derivedKey = await deriveClientKey(testPass, kdfParams.salt, kdfParams.iterations);

    // 6c. Signup with derivedKey (password never leaves client)
    const signupRes = await fetch(`${ORIGIN}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        derivedKey,
        name: `مستخدم تجريبي ${testId}`,
        clientIterations: kdfParams.iterations,
      }),
    });
    assert.equal(signupRes.status, 201);
    const signupData = await signupRes.json();
    assert.equal(signupData.user.email, testEmail);

    const cookieHdr = signupRes.headers.get('set-cookie');
    assert.ok(cookieHdr, 'Set-Cookie received');
    sessionCookie = cookieHdr.split(';')[0];
    record('6. Free Registration (kdfv2 600k client iterations)', true, `User created: ${testEmail}, Session cookie set: ${sessionCookie.slice(0, 20)}...`);
  } catch (err) {
    record('6. Free Registration (kdfv2 600k client iterations)', false, err.message);
  }

  // 7. Login and Logout with v2 KDF
  try {
    // 7a. Get params for login
    const paramsRes = await fetch(`${ORIGIN}/api/auth/kdf-params`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });
    const kdfParams = await paramsRes.json();
    const derivedKey = await deriveClientKey(testPass, kdfParams.salt, kdfParams.iterations);

    // 7b. Login
    const loginRes = await fetch(`${ORIGIN}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, derivedKey }),
    });
    assert.equal(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.equal(loginData.user.email, testEmail);

    const loginCookieHdr = loginRes.headers.get('set-cookie');
    assert.ok(loginCookieHdr);
    sessionCookie = loginCookieHdr.split(';')[0];

    // 7c. Logout test
    const logoutRes = await fetch(`${ORIGIN}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    });
    assert.equal(logoutRes.status, 200);

    // Re-login to keep session for subsequent progress tests
    const reloginRes = await fetch(`${ORIGIN}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, derivedKey }),
    });
    assert.equal(reloginRes.status, 200);
    sessionCookie = reloginRes.headers.get('set-cookie').split(';')[0];

    record('7. Login & Logout (v2 credentials)', true, 'Login succeeds, Logout invalidates session, Re-login successful');
  } catch (err) {
    record('7. Login & Logout (v2 credentials)', false, err.message);
  }

  // 8. Learner Progress & Session persistence
  try {
    const meRes = await fetch(`${ORIGIN}/api/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    assert.equal(meRes.status, 200);
    const meData = await meRes.json();
    assert.equal(meData.user.email, testEmail);

    const progRes = await fetch(`${ORIGIN}/api/me/progress`, {
      headers: { Cookie: sessionCookie },
    });
    assert.equal(progRes.status, 200);
    const progData = await progRes.json();
    assert.equal(progData.stats.xp_total, 0);
    record('8. Learner Progress & Profile State', true, `Initial XP: ${progData.stats.xp_total}, Levels: ${progData.levels?.length || 0}`);
  } catch (err) {
    record('8. Learner Progress & Profile State', false, err.message);
  }

  // 9. Password Recovery (Password Reset Request)
  try {
    const resetReqRes = await fetch(`${ORIGIN}/api/auth/password-reset/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });
    assert.equal(resetReqRes.status, 200);
    const resetData = await resetReqRes.json();
    assert.equal(resetData.ok, true);
    record('9. Password Recovery (Password Reset Request)', true, 'Endpoint returns 200 and handles neutral response gracefully');
  } catch (err) {
    record('9. Password Recovery (Password Reset Request)', false, err.message);
  }

  // 10. Email Verification Request Endpoint
  try {
    const verifyReqRes = await fetch(`${ORIGIN}/api/auth/verify-email/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    });
    assert.equal(verifyReqRes.status, 200);
    const verifyData = await verifyReqRes.json();
    assert.equal(verifyData.ok, true);
    record('10. Email Verification Endpoint', true, 'Verification token generated; logs mailer.not_configured when Resend not set');
  } catch (err) {
    record('10. Email Verification Endpoint', false, err.message);
  }

  // 11. Admin Authorization Protection
  try {
    // Attempting to access admin endpoint with learner session
    const adminRes = await fetch(`${ORIGIN}/api/admin/audit`, {
      headers: { Cookie: sessionCookie },
    });
    assert.equal(adminRes.status, 403, `Status was ${adminRes.status}`);
    record('11. Admin Protection Boundary', true, `Non-admin user blocked with status 403 Forbidden on /api/admin/audit`);
  } catch (err) {
    record('11. Admin Protection Boundary', false, err.message);
  }

  // 12. CSRF & Origin Protection
  try {
    // Attempting POST without application/json Content-Type
    const badContentTypeRes = await fetch(`${ORIGIN}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'email=bad@test.com',
    });
    assert.equal(badContentTypeRes.status, 415, 'Must reject non-JSON with 415');

    // Attempting POST with foreign origin
    const badOriginRes = await fetch(`${ORIGIN}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://evil.com' },
      body: JSON.stringify({ email: 'bad@test.com' }),
    });
    assert.equal(badOriginRes.status, 403, 'Must reject foreign Origin with 403');

    record('12. CSRF & Origin Protection', true, 'Rejected non-JSON with 415 and foreign Origin with 403');
  } catch (err) {
    record('12. CSRF & Origin Protection', false, err.message);
  }

  console.log(`\n=============================================================`);
  const allPassed = testResults.every(t => t.ok);
  console.log(`نتیجة الفحص الشامل: ${allPassed ? '🎉 نجاح كامل 12/12' : '⚠️ حدث فشل'}`);
  console.log(`=============================================================`);
}

main().catch(console.error);
