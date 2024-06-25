export { EPSILON, radians, degrees, clamp, range, hex, isPowerOf2, };
// =============================================================================
// Constants
// =============================================================================
/// Module-wide epsilon value.
const EPSILON = 0.0000001;
// =============================================================================
// Functions
// =============================================================================
/// Radians from degrees.
/// @param degrees Angle in degrees
/// @returns Angle in radians
function radians(degrees) { return degrees * Math.PI / 180; }
/// Degrees from radians.
/// @param radians Angle in radians
/// @returns Angle in degrees
function degrees(radians) { return radians * 180 / Math.PI; }
/// Clamp a value between a minimum and maximum.
/// @param x Value to clamp
/// @param min Minimum value
/// @param max Maximum value
/// @returns Clamped value
function clamp(x, min, max) { return Math.min(Math.max(x, min), max); }
/// Python-like integer range function.
/// @param start Start value (or stop if stop is undefined).
/// @param stop Stop value
/// @param step Step per iteration. Defaults to 1.
/// @returns Iterable range object
function* range(start, stop, step = 1) {
    start = Math.round(start);
    if (stop === undefined) {
        stop = start;
        start = 0;
    }
    else {
        stop = Math.round(stop);
    }
    step = Math.max(1, Math.round(Math.abs(step)));
    const sign = Math.sign(stop - start) || 1;
    while (Math.sign(stop - start) !== -sign) { // sign matches or is zero
        yield start;
        start += step * sign;
    }
}
/// Convert a number to a hexadecimal string.
/// @param value Number to convert
/// @returns Hexadecimal string
function hex(value) {
    return value.toString(16).padStart(2, '0');
}
/// Returns true if the given value is a power of 2.
function isPowerOf2(value) {
    return Number.isInteger(value) && (value & (value - 1)) === 0;
}
/// Returns the number of digits in the given value.
export function countDigits(value) {
    return value === 0 ? 1 : Math.floor(Math.log10(Math.abs(value))) + 1;
}
/// Rounds up a value to the next multiple of two.
export function nextEven(value) {
    return Math.ceil(value / 2) * 2;
}
/// Maps a value from one range to another.
/// @param value Input value
/// @param inLow Lower bound of the input range
/// @param inHigh Upper bound of the input range
/// @param outLow Lower bound of the output range (defaults to 0).
/// @param outHigh Upper bound of the output range (defaults to 1).
export function mapRange(value, inLow, inHigh, outLow = 0, outHigh = 1) {
    return outLow + ((value - inLow) / (inHigh - inLow)) * (outHigh - outLow);
}
