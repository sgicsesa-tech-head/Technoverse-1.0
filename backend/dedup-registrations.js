/**
 * dedup-registrations.js
 * ──────────────────────
 * Standalone script that finds and deletes duplicate Firestore registrations.
 *
 * A group of documents is considered duplicate when ALL five fields match:
 *   candidateName · candidatePhone · candidateEmail · transactionId · competitionName
 *
 * For every duplicate group the OLDEST document (lowest createdAt / registrationDate)
 * is KEPT, and every later copy is DELETED.
 *
 * Usage:
 *   node dedup-registrations.js          ← dry-run  (shows what would be deleted)
 *   node dedup-registrations.js --delete  ← actually deletes duplicates
 *
 * The script reuses the same Firebase credentials as the rest of the backend
 * (FIREBASE_SERVICE_ACCOUNT env-var, individual vars, or firebase-service-account.json).
 *
 * Run from the backend/ directory (so .env and the service-account file are found):
 *   cd backend
 *   node dedup-registrations.js
 *   node dedup-registrations.js --delete
 */

'use strict';
require('dotenv').config();
const admin = require('firebase-admin');
const path  = require('path');

// ── 1. Initialise Firebase ────────────────────────────────────────────────────
function initFirebase() {
  if (admin.apps.length > 0) return admin.firestore();

  let serviceAccount = null;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('🔑  Using FIREBASE_SERVICE_ACCOUNT env var');
    } catch (_) { /* fall through */ }
  }

  if (!serviceAccount && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    serviceAccount = {
      type: 'service_account',
      project_id:   process.env.FIREBASE_PROJECT_ID,
      private_key:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };
    console.log('🔑  Using individual FIREBASE_* env vars');
  }

  if (!serviceAccount) {
    const filePath = path.join(__dirname, 'firebase-service-account.json');
    try {
      serviceAccount = require(filePath);
      console.log('🔑  Using firebase-service-account.json');
    } catch (_) { /* fall through */ }
  }

  if (!serviceAccount) {
    console.error('❌  Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT, individual FIREBASE_* env vars, or place firebase-service-account.json in backend/');
    process.exit(1);
  }

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  return admin.firestore();
}

// ── 2. Build a deduplication key ─────────────────────────────────────────────
function dedupKey(doc) {
  const d = doc.data();
  return [
    (d.candidateName   || '').trim().toLowerCase(),
    (d.candidatePhone  || '').trim(),
    (d.candidateEmail  || '').trim().toLowerCase(),
    (d.transactionId   || '').trim(),
    (d.competitionName || '').trim().toLowerCase(),
  ].join('||');
}

// ── 3. Pick the "oldest" document to keep ────────────────────────────────────
function sortKey(doc) {
  const d = doc.data();
  // createdAt is a Firestore Timestamp; registrationDate is an ISO string fallback
  if (d.createdAt && d.createdAt.toMillis) return d.createdAt.toMillis();
  if (d.registrationDate) return new Date(d.registrationDate).getTime();
  return 0;
}

// ── 4. Main ───────────────────────────────────────────────────────────────────
async function main() {
  const DRY_RUN = !process.argv.includes('--delete');

  if (DRY_RUN) {
    console.log('\n⚠️   DRY-RUN mode — nothing will be deleted.');
    console.log('    Re-run with --delete to actually remove duplicates.\n');
  } else {
    console.log('\n🗑️   LIVE DELETE mode — duplicates will be permanently deleted.\n');
  }

  const db       = initFirebase();
  const snapshot = await db.collection('registrations').get();

  console.log(`📋  Total documents fetched: ${snapshot.size}\n`);

  // Group documents by their dedup key
  const groups = new Map();        // key → [ snap, snap, … ]
  snapshot.forEach(doc => {
    const k = dedupKey(doc);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(doc);
  });

  // Find groups with more than one document
  const duplicateGroups = [...groups.values()].filter(g => g.length > 1);

  if (duplicateGroups.length === 0) {
    console.log('✅  No duplicates found. Database is clean!');
    process.exit(0);
  }

  console.log(`🔍  Found ${duplicateGroups.length} duplicate group(s):\n`);

  let totalToDelete = 0;
  const toDelete = [];          // document IDs to delete

  for (const group of duplicateGroups) {
    // Sort ascending by timestamp → first element is oldest (kept)
    group.sort((a, b) => sortKey(a) - sortKey(b));

    const keep    = group[0];
    const delDocs = group.slice(1);

    const d = keep.data();
    console.log(`  ┌─ Group (${group.length} docs):`);
    console.log(`  │  Name        : ${d.candidateName}`);
    console.log(`  │  Phone       : ${d.candidatePhone}`);
    console.log(`  │  Email       : ${d.candidateEmail}`);
    console.log(`  │  Transaction : ${d.transactionId}`);
    console.log(`  │  Competition : ${d.competitionName}`);
    console.log(`  │  KEEP  → id  : ${keep.id}`);

    for (const dup of delDocs) {
      console.log(`  │  DELETE → id : ${dup.id}`);
      toDelete.push(dup.id);
    }
    console.log(`  └─`);
    totalToDelete += delDocs.length;
  }

  console.log(`\n  Docs to keep   : ${duplicateGroups.length}`);
  console.log(`  Docs to delete : ${totalToDelete}`);

  if (DRY_RUN) {
    console.log('\n⚠️   Dry-run complete — no changes made.');
    console.log('    Run with --delete to apply.\n');
    process.exit(0);
  }

  // Perform deletion in batches of 500 (Firestore limit)
  console.log('\n🗑️   Deleting duplicates…');
  const BATCH_SIZE = 500;
  for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = toDelete.slice(i, i + BATCH_SIZE);
    chunk.forEach(id => batch.delete(db.collection('registrations').doc(id)));
    await batch.commit();
    console.log(`    Deleted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} doc(s)`);
  }

  console.log(`\n✅  Done! ${totalToDelete} duplicate(s) deleted.\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
