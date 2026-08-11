/**
 * Prize-pool formatting utilities.
 *
 * The `hackathons.prize_pool` column is free-text (e.g. "$50,000", "50k EUR",
 * "TBA", "N/A", "", or null). These helpers parse it into a number when
 * possible and format aggregates cleanly, falling back gracefully when there
 * is no usable figure.
 */

/**
 * Parse a free-text prize string into a number of (assumed USD) units.
 * Returns null when no sensible figure can be extracted.
 *
 * Handles: "$50,000", "50.000 €", "50k", "1.2M", "USD 10000", "TBA" -> null.
 */
export function parsePrize(raw: string | null | undefined): number | null {
    if (!raw) return null;
    const text = String(raw).trim().toLowerCase();
    if (!text || text === 'n/a' || text === 'tba' || text === 'none') return null;

    // Find the first numeric token, optionally followed by a k/m multiplier.
    const match = text.match(/(\d[\d.,]*)\s*(k|m|bn|b)?/);
    if (!match) return null;

    // Normalise thousands/decimal separators: strip commas and spaces used as
    // thousands separators, keep a single decimal point.
    let numStr = match[1].replace(/\s/g, '');
    if (numStr.includes(',') && numStr.includes('.')) {
        // Assume comma = thousands, dot = decimal (e.g. "50,000.00")
        numStr = numStr.replace(/,/g, '');
    } else if (numStr.includes(',')) {
        // Ambiguous "50,000" -> thousands; "1,2" (rare) -> treat comma as thousands too.
        numStr = numStr.replace(/,/g, '');
    }

    let value = parseFloat(numStr);
    if (isNaN(value)) return null;

    const suffix = match[2];
    if (suffix === 'k') value *= 1_000;
    else if (suffix === 'm') value *= 1_000_000;
    else if (suffix === 'b' || suffix === 'bn') value *= 1_000_000_000;

    return value > 0 ? Math.round(value) : null;
}

/** Sum a list of free-text prize strings, ignoring unparseable ones. */
export function sumPrizes(raws: Array<string | null | undefined>): number {
    return raws.reduce<number>((total, raw) => {
        const v = parsePrize(raw);
        return v ? total + v : total;
    }, 0);
}

/**
 * Format a number as a clean USD string, e.g. 50000 -> "$50,000",
 * 1_200_000 -> "$1.2M". Returns null for zero/negative so callers can hide
 * the figure entirely rather than print "$0".
 */
export function formatMoney(amount: number | null | undefined): string | null {
    if (!amount || amount <= 0) return null;
    if (amount >= 1_000_000) {
        const m = amount / 1_000_000;
        return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
    }
    return `$${amount.toLocaleString('en-US')}`;
}
