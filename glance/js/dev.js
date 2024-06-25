// =============================================================================
// Logging
// =============================================================================
/// The verbose code contains more and detailled log messages.
const VERBOSE = true;
/// Logs a message to the console if VERBOSE is true.
/// @param message Message to log if VERBOSE is true.
///  Is a function to avoid evaluating the condition if VERBOSE is false.
// @ts-ignore: Unused function
export function logInfo(message) {
    if (VERBOSE) {
        console.log(message());
    }
}
/// Logs a warning to the console if VERBOSE is true.
/// @param message Message to log if VERBOSE is true.
///  Is a function to avoid evaluating the condition if VERBOSE is false.
// @ts-ignore: Unused function
export function logWarning(message) {
    if (VERBOSE) {
        console.warn(message());
    }
}
/// Logs an error to the console if VERBOSE is true.
/// @param message Message to log if VERBOSE is true.
///  Is a function to avoid evaluating the condition if VERBOSE is false.
// @ts-ignore: Unused function
export function logError(message) {
    if (VERBOSE) {
        console.error(message());
    }
}
/// Throws an error with a detailed message if VERBOSE is true,
/// otherwise throws a generic error.
/// @param message Error message to throw if VERBOSE is true.
///  Is a function to avoid evaluating the condition if VERBOSE is false.
// @ts-ignore: Unused function
export function throwError(message) {
    if (VERBOSE) {
        throw new Error(message());
    }
    else { // LATER: Add error ids for release mode.
        throw new Error("An error occurred.");
    }
}
/// Throws an error if the given condition is false.
/// @param condition Condition funtion producing a truth value and error message.
///  Is a function to avoid evaluating the condition if VERBOSE is false.
// @ts-ignore: Unused function
export function assert(condition) {
    if (VERBOSE) {
        const [result, message] = condition();
        if (!result) {
            throw new Error(message);
        }
    }
}
/// Ensures that the given value is not undefined.
export function assertDefined(value) {
    // TODO: check that this is compiled away in production
    if (VERBOSE && value === undefined) {
        throw new Error("Value is undefined.");
    }
    return value;
}
// =============================================================================
// Javascript
// =============================================================================
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
export const AsyncFunction = async function () { }.constructor;
/// Returns true if the given value is a primitive.
export function isPrimitive(value) {
    return value === null || value === undefined || typeof value !== "object";
}
/// Deep comparison between two objects.
export function areEqual(a, b) {
    if (a === b)
        return true;
    if (a === null || b === null || a === undefined || b === undefined)
        return false;
    if (typeof a !== typeof b)
        return false;
    if (typeof a !== "object")
        return false;
    if (Array.isArray(a)) {
        if (!Array.isArray(b))
            return false;
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (!areEqual(a[i], b[i]))
                return false;
        }
    }
    else {
        const keysA = Object.keys(a);
        if (keysA.length !== Object.keys(b).length)
            return false;
        for (const key of keysA) {
            if (!areEqual(a[key], b[key]))
                return false;
        }
    }
    return true;
}
/// Return a shallow clone of the given value.
export function shallowClone(value) {
    // Return primitive values as-is.
    if (isPrimitive(value)) {
        return value;
    }
    // If the value has a `clone` method, use it.
    else if (typeof value.clone === 'function') {
        return value.clone();
    }
    // If the value is an array clone it.
    else if (Array.isArray(value)) {
        return [...value];
    }
    // Otherwise, the value has to be an object and we can create a shallow clone.
    else {
        return { ...value };
    }
}
/// Perform a shallow copy from the origin to the target in-place.
export function shallowCopy(target, origin) {
    // If the target is a primitive, we cannot update it in-place.
    if (isPrimitive(target)) {
        throwError(() => `Cannot copy to a null / undefined value in-place.`);
    }
    // If the target has a `copy` method, use it.
    if (typeof target.copy === 'function') {
        target.copy(origin);
    }
    // If the target is an array create a shallow copy.
    else if (Array.isArray(target)) {
        if (Array.isArray(origin)) {
            target.splice(0, target.length, ...origin);
        }
        else if (origin.isMathPrimitive) { // glance.Vec2, glance.Vec3, etc.
            target.splice(0, target.length, ...origin);
        }
        else {
            throwError(() => `Cannot copy an array to a non-array.`);
        }
    }
    // Otherwise, the target has to be an object and we can update it in-place.
    else {
        for (var key in target) {
            delete target[key];
        }
        Object.assign(target, origin);
    }
}
// =============================================================================
// Typescript
// =============================================================================
/// Use this function to assert that a value is unreachable.
/// This is useful to check that all cases of a switch statement are handled.
export function assertUnreachable(x) {
    throw new Error(`Unexpected object: ${x}`);
}
