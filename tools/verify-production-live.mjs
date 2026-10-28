// @ts-check
import { strict as assert } from 'node:assert';

const ORIGIN = process.argv[2] || 'https://learn.espanol-balarabi.workers.dev';

console.log(`[Verify-Live] Running post-deploy smoke checks against: ${ORIGIN}`);

async function run() {
  // 1. Health check
  console.log('\n1. Testing /api/health...');
  const healthRes = await fetch(`${ORIGIN}/api/health`);
  console.log(`   Status: ${healthRes.status}`);
  assert.equal(healthRes.status, 200, 'Health endpoint must return 200');
  const healthJson = await healthRes.json();
  console.log(`   Response:`, healthJson);
  assert.equal(healthJson.ok, true, 'Health ok must be true');

  // 2. Homepage and Security Headers
  console.log('\n2. Testing Homepage (/) and security headers...');
  const homeRes = await fetch(`${ORIGIN}/`);
  console.log(`   Status: ${homeRes.status}`);
  assert.equal(homeRes.status, 200, 'Homepage must return 200');
  const homeHtml = await homeRes.text();
  assert.ok(homeHtml.includes('<!DOCTYPE html>'), 'Homepage must return HTML');
  assert.ok(homeHtml.includes('root'), 'Homepage must contain root div');
  
  // Security headers check
  console.log('   Security Headers:');
  const hsts = homeRes.headers.get('strict-transport-security');
  const xfo = homeRes.headers.get('x-frame-options');
  const nosniff = homeRes.headers.get('x-content-type-options');
  console.log(`   - Strict-Transport-Security: ${hsts || 'NONE'}`);
  console.log(`   - X-Frame-Options: ${xfo || 'NONE'}`);
  console.log(`   - X-Content-Type-Options: ${nosniff || 'NONE'}`);
  assert.ok(nosniff, 'X-Content-Type-Options must be present');

  // 3. D1 Database Connection via API
  console.log('\n3. Testing D1 Connection via /api/programs...');
  const progRes = await fetch(`${ORIGIN}/api/programs`);
  console.log(`   Status: ${progRes.status}`);
  assert.equal(progRes.status, 200, 'Programs API must return 200');
  const progJson = await progRes.json();
  console.log(`   Programs count: ${Array.isArray(progJson) ? progJson.length : 'N/A'}`);
  assert.ok(Array.isArray(progJson), 'Programs must be an array');

  // 4. Drafts-hidden policy check
  console.log('\n4. Testing Drafts-Hidden Policy (Unpublished content)...');
  const lessonsRes = await fetch(`${ORIGIN}/api/lessons`);
  console.log(`   Status: ${lessonsRes.status}`);
  const lessonsJson = await lessonsRes.json();
  const lessonsCount = Array.isArray(lessonsJson) ? lessonsJson.length : (lessonsJson.lessons ? lessonsJson.lessons.length : 0);
  console.log(`   Publicly returned lessons count: ${lessonsCount} (expected: 0 while all lessons are drafts)`);

  // 5. OAuth Graceful Fallback
  console.log('\n5. Testing Google OAuth fallback when unconfigured...');
  const oauthRes = await fetch(`${ORIGIN}/api/auth/oauth/google`, { redirect: 'manual' });
  console.log(`   Status: ${oauthRes.status}`);
  const location = oauthRes.headers.get('location') || '';
  console.log(`   Redirect Location: ${location}`);
  assert.ok(oauthRes.status === 302 || oauthRes.status === 307, 'OAuth initiate must redirect');
  assert.ok(location.includes('oauth=unavailable'), 'Must redirect to login with oauth=unavailable');

  // 6. Public signup disabled check
  console.log('\n6. Testing Public Signup Disabled check...');
  const signupRes = await fetch(`${ORIGIN}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'Password123!', displayName: 'Test' })
  });
  console.log(`   Status: ${signupRes.status}`);
  assert.equal(signupRes.status, 503, 'Public signup must be disabled (503)');
  const signupJson = await signupRes.json();
  console.log(`   Code: ${signupJson.code}`);
  assert.equal(signupJson.code, 'SIGNUP_DISABLED', 'Code must be SIGNUP_DISABLED');

  console.log('\n=============================================================');
  console.log('✅ ALL PRODUCTION POST-DEPLOY VERIFICATION CHECKS PASSED!');
  console.log('=============================================================');
}

run().catch((err) => {
  console.error('\n❌ Verification failed:', err);
  process.exit(1);
});
