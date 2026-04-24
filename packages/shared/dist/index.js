"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STELLAR_NETWORK = void 0;
exports.stroopsToXLM = stroopsToXLM;
exports.xlmToStroops = xlmToStroops;
exports.formatXLM = formatXLM;
exports.timestampToDate = timestampToDate;
exports.formatTimestamp = formatTimestamp;
exports.validateContribution = validateContribution;
exports.calculatePayoutAmount = calculatePayoutAmount;
// ============================================================
// Network constants
// ============================================================
exports.STELLAR_NETWORK = {
    testnet: 'https://horizon-testnet.stellar.org',
    mainnet: 'https://horizon.stellar.org',
};
// ============================================================
// Utility functions
// ============================================================
/**
 * Convert stroops to XLM.
 * 1 XLM = 10,000,000 stroops
 */
function stroopsToXLM(stroops) {
    return Number(stroops) / 10000000;
}
/**
 * Convert XLM to stroops.
 */
function xlmToStroops(xlm) {
    return BigInt(Math.floor(xlm * 10000000));
}
/**
 * Format a stroops amount as a human-readable XLM string.
 * e.g. 500000000n → "50.00 XLM"
 */
function formatXLM(stroops) {
    const xlm = stroopsToXLM(stroops);
    return `${xlm.toLocaleString(undefined, { maximumFractionDigits: 2 })} XLM`;
}
/**
 * Convert a Unix timestamp (seconds) to a JS Date object.
 */
function timestampToDate(timestamp) {
    return new Date(Number(timestamp) * 1000);
}
/**
 * Format a Unix timestamp as a readable date string.
 * e.g. 1704067200n → "Jan 1, 2024"
 */
function formatTimestamp(timestamp) {
    return timestampToDate(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
/**
 * Returns true if a contribution amount matches the required group amount.
 */
function validateContribution(amount, required) {
    return amount === required;
}
/**
 * Calculate the total payout pool for a group.
 * Deducts the platform fee before returning.
 */
function calculatePayoutAmount(contributionAmount, totalMembers, platformFeePercent) {
    const totalPool = contributionAmount * BigInt(totalMembers);
    const fee = (totalPool * BigInt(platformFeePercent)) / 10000n;
    return totalPool - fee;
}
