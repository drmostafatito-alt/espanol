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
  assert.equal(healthJson.env, 'production', 'Environment must be production');
  assert.equal(healthJson.db.reachable, true, 'Database must be reachable');

  // 2. Homepage and Security Headers
  console.log('\n2. Testing Homepage (/) and security headers...');
  const homeRes = await fetch(`${ORIGIN}/`);
  console.log(`   Status: ${homeRes.status}`);
  assert.equal(homeRes.status, 200, 'Homepage must return 200');
  const homeHtml = await homeRes.text();
  assert.ok(homeHtml.toLowerCase().includes('<!doctype html>'), 'Homepage must return HTML');
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

  // 3. D1 Database Connection via /api/content/paths
  console.log('\n3. Testing D1 Connection via /api/content/paths...');
  const pathsRes = await fetch(`${ORIGIN}/api/content/paths`);
  console.log(`   Status: ${pathsRes.status}`);
  assert.equal(pathsRes.status, 200, 'Content paths API must return 200');
  const pathsJson = await pathsRes.json();
  console.log(`   Paths array length: ${Array.isArray(pathsJson.paths) ? pathsJson.paths.length : 'N/A'}`);
  assert.ok(Array.isArray(pathsJson.paths), 'paths must be an array');

  // 4. Drafts-hidden policy check
  console.log('\n4. Testing Drafts-Hidden Policy (Unpublished content)...');
  const lessonRes = await fetch(`${ORIGIN}/api/content/lessons/prea1-abecedario`);
  console.log(`   Status: ${lessonRes.status}`);
  // In production, unauthenticated requests for draft lessons return 404 (hidden)
  assert.equal(lessonRes.status, 404, 'Unapproved draft lesson must return 404 in production to public');
  console.log(`   Draft lesson correctly hidden from public (404 Not Found)`);

  // 5. Search API
  console.log('\n5. Testing Vocabulary Search API (/api/content/search?q=hola)...');
  const searchRes = await fetch(`${ORIGIN}/api/content/search?q=hola`);
  console.log(`   Status: ${searchRes.status}`);
  assert.equal(searchRes.status, 200, 'Search API must return 200');
  const searchJson = await searchRes.json();
  console.log(`   Search results found:`, Array.isArray(searchJson.results) ? searchJson.results.length : 0);
  assert.ok(Array.isArray(searchJson.results) && searchJson.results.length > 0, 'Must find at least 1 result for hola');

  // 6. OAuth initiation
  console.log('\n6. Testing Google OAuth initiation (/api/auth/oauth/google/start)...');
  const oauthRes = await fetch(`${ORIGIN}/api/auth/oauth/google/start`, { redirect: 'manual' });
  console.log(`   Status: ${oauthRes.status}`);
  const location = oauthRes.headers.get('location') || '';
  console.log(`   Redirect Location: ${location.slice(0, 110)}...`);
  assert.ok(oauthRes.status === 302 || oauthRes.status === 307, 'OAuth initiate must redirect');
  assert.ok(location.includes('accounts.google.com'), 'Must redirect to Google OAuth login URL');

  // 7. Public signup disabled check
  console.log('\n7. Testing Public Signup Disabled check (/api/auth/signup)...');
  const signupRes = await fetch(`${ORIGIN}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'Password123!', displayName: 'Test' })
  });
  console.log(`   Status: ${signupRes.status}`);
  assert.equal(signupRes.status, 503, 'Public signup must be disabled (503)');
  const signupJson = await signupRes.json();
  const code = signupJson.error?.code || signupJson.code;
  console.log(`   Error Code: ${code} - Message: ${signupJson.error?.message}`);
  assert.equal(code, 'SIGNUP_DISABLED', 'Code must be SIGNUP_DISABLED');

  console.log('\n=============================================================');
  console.log('🎉 ALL 7 PRODUCTION POST-DEPLOY VERIFICATION CHECKS PASSED!');
  console.log(`🌐 LIVE PRODUCTION URL: ${ORIGIN}`);
  console.log('=============================================================');
}

run().catch((err) => {
  console.error('\n❌ Verification failed:', err);
  process.exit(1);
});
