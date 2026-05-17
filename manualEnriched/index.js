/**
 * Manual Enrichment Data — Dynamic Barrel Index
 * ─────────────────────────────────────────────────────────────────
 * Uses Vite's import.meta.glob to load ALL per-college JSON files
 * from manualEnriched/ at build time. No individual imports needed.
 *
 * Only colleges with both `lastVerified` and `verifiedBy` set are considered "verified".
 *
 * Usage:
 *   import { manualEnrichedData, hasVerifiedData, getVerifiedData } from '../data/manualEnriched/index.js';
 */

// Eagerly import all JSON files (Vite resolves at build time)
const jsonModules = import.meta.glob('./*.json', { eager: true });

/**
 * Map of college slug → enrichment data.
 * Keys are derived from filenames (e.g. './iit-madras.json' → 'iit-madras').
 */
export const manualEnrichedData = {};

for (const [path, module] of Object.entries(jsonModules)) {
    // Skip tracking/meta files
    if (path.startsWith('./_')) continue;
    if (path.includes('verifiedProgress')) continue;

    const slug = path.replace('./', '').replace('.json', '');
    manualEnrichedData[slug] = module.default || module;
}

/**
 * Check if a college has VERIFIED manual data.
 * Only returns true if both lastVerified and verifiedBy are set (not empty).
 * @param {string} collegeId
 * @returns {boolean}
 */
export const hasVerifiedData = (collegeId) => {
    const data = manualEnrichedData[collegeId];
    return data != null && !!data.lastVerified && !!data.verifiedBy;
};

/**
 * Get verified manual data for a college, or null if not available/verified.
 * Returns full data even if unverified — use hasVerifiedData() for badge logic.
 * @param {string} collegeId
 * @returns {object|null}
 */
export const getVerifiedData = (collegeId) => {
    return manualEnrichedData[collegeId] || null;
};

export default manualEnrichedData;
