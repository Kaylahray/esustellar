export type GroupStatus = 'Open' | 'Active' | 'Completed' | 'Paused';
export type MemberStatus = 'Active' | 'PaidCurrentRound' | 'Overdue' | 'Defaulted' | 'ReceivedPayout';
export type Frequency = 'Weekly' | 'BiWeekly' | 'Monthly';
export interface SavingsGroup {
    group_id: string;
    admin: string;
    name: string;
    contribution_amount: bigint;
    total_members: number;
    frequency: Frequency;
    start_timestamp: bigint;
    status: GroupStatus;
    is_public: boolean;
    current_round: number;
    platform_fee_percent: number;
}
export interface Member {
    address: string;
    join_timestamp: bigint;
    join_order: number;
    status: MemberStatus;
    total_contributed: bigint;
    has_received_payout: boolean;
    payout_round: number;
}
export interface Contribution {
    member: string;
    amount: bigint;
    round: number;
    timestamp: bigint;
}
export interface Payout {
    recipient: string;
    amount: bigint;
    round: number;
    timestamp: bigint;
}
export interface GroupInfo {
    contract_address: string;
    group_id: string;
    name: string;
    admin: string;
    is_public: boolean;
    created_at: bigint;
    total_members: number;
}
export interface CreateGroupParams {
    groupId: string;
    name: string;
    contributionAmount: bigint;
    totalMembers: number;
    frequency: Frequency;
    startTimestamp: bigint;
    isPublic: boolean;
}
export declare const STELLAR_NETWORK: {
    readonly testnet: "https://horizon-testnet.stellar.org";
    readonly mainnet: "https://horizon.stellar.org";
};
/**
 * Convert stroops to XLM.
 * 1 XLM = 10,000,000 stroops
 */
export declare function stroopsToXLM(stroops: bigint | number): number;
/**
 * Convert XLM to stroops.
 */
export declare function xlmToStroops(xlm: number): bigint;
/**
 * Format a stroops amount as a human-readable XLM string.
 * e.g. 500000000n → "50.00 XLM"
 */
export declare function formatXLM(stroops: bigint | number): string;
/**
 * Convert a Unix timestamp (seconds) to a JS Date object.
 */
export declare function timestampToDate(timestamp: bigint | number): Date;
/**
 * Format a Unix timestamp as a readable date string.
 * e.g. 1704067200n → "Jan 1, 2024"
 */
export declare function formatTimestamp(timestamp: bigint | number): string;
/**
 * Returns true if a contribution amount matches the required group amount.
 */
export declare function validateContribution(amount: bigint, required: bigint): boolean;
/**
 * Calculate the total payout pool for a group.
 * Deducts the platform fee before returning.
 */
export declare function calculatePayoutAmount(contributionAmount: bigint, totalMembers: number, platformFeePercent: number): bigint;
