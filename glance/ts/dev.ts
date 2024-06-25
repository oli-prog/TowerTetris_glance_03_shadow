// =============================================================================
// Logging
// =============================================================================


/// The verbose code contains more and detailled log messages.
const VERBOSE: boolean = import.meta.env.DEV || import.meta.env.SSR;
if (import.meta.env.SSR) {
    console.log(`Using glance in ${VERBOSE ? "verbose" : "silent"} mode.`);
}


/// Logs a message to the console if VERBOSE is true.
/// @param message Message to log if VERBOSE is true.
///  Is a function to avoid evaluating the condition if VERBOSE is false.
// @ts-ignore: Unused function
export function logInfo(message: () => string): void
{
    if (VERBOSE) {
        console.log(message());
    }
}


/// Logs a warning to the console if VERBOSE is true.
/// @param message Message to log if VERBOSE is true.
///  Is a function to avoid evaluating the condition if VERBOSE is false.
// @ts-ignore: Unused function
export function logWarning(message: () => string): void
{
    if (VERBOSE) {
        console.warn(message());
    }
}


/// Logs an error to the console if VERBOSE is true.
/// @param message Message to log if VERBOSE is true.
///  Is a function to avoid evaluating the condition if VERBOSE is false.
// @ts-ignore: Unused function
export function logError(message: () => string): void
{
    if (VERBOSE) {
        console.error(message());
    }
}


/// Throws an error with a detailed message if VERBOSE is true,
/// otherwise throws a generic error.
/// @param message Error message to throw if VERBOSE is true.
///  Is a function to avoid evaluating the condition if VERBOSE is false.
// @ts-ignore: Unused function
export function throwError(message: () => string): never
{
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
export function assert(condition: () => [boolean, string]): void
{
    if (VERBOSE) {
        const [result, message] = condition();
        if (!result) {
            throw new Error(message);
        }
    }
}


/// Ensures that the given value is not undefined.
export function assertDefined<T>(value: T | undefined): T
{
    // TODO: check that this is compiled away in production
    if (VERBOSE && value === undefined) {
        throw new Error("Value is undefined.");
    }
    return value!;
}


// =============================================================================
// Javascript
// =============================================================================


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
export const AsyncFunction = async function () { }.constructor;


/// Returns true if the given value is a primitive.
export function isPrimitive(value: any): value is null | undefined | string | number | boolean
{
    return value === null || value === undefined || typeof value !== "object";
}


/// Deep comparison between two objects.
export function areEqual<T>(a: T, b: T): boolean
{
    if (a === b) return true;
    if (a === null || b === null || a === undefined || b === undefined) return false;
    if (typeof a !== typeof b) return false;
    if (typeof a !== "object") return false;
    if (Array.isArray(a)) {
        if (!Array.isArray(b)) return false;
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!areEqual(a[i], b[i])) return false;
        }
    } else {
        const keysA = Object.keys(a);
        if (keysA.length !== Object.keys(b).length) return false;
        for (const key of keysA) {
            if (!areEqual((a as any)[key], (b as any)[key])) return false;
        }
    }
    return true;
}


/// Return a shallow clone of the given value.
export function shallowClone<T>(value: T): T
{
    // Return primitive values as-is.
    if (isPrimitive(value)) {
        return value;
    }
    // If the value has a `clone` method, use it.
    else if (typeof (value as any).clone === 'function') {
        return (value as any).clone();
    }
    // If the value is an array clone it.
    else if (Array.isArray(value)) {
        return [...value] as any;
    }
    // Otherwise, the value has to be an object and we can create a shallow clone.
    else {
        return { ...value } as any;
    }
}


/// Perform a shallow copy from the origin to the target in-place.
export function shallowCopy<T extends {}>(target: T, origin: T): void
{
    // If the target is a primitive, we cannot update it in-place.
    if (isPrimitive(target)) {
        throwError(() => `Cannot copy to a null / undefined value in-place.`);
    }
    // If the target has a `copy` method, use it.
    if (typeof (target as any).copy === 'function') {
        (target as any).copy(origin);
    }
    // If the target is an array create a shallow copy.
    else if (Array.isArray(target)) {
        if (Array.isArray(origin)) {
            target.splice(0, target.length, ...origin);
        } else if ((origin as any).isMathPrimitive) { // glance.Vec2, glance.Vec3, etc.
            target.splice(0, target.length, ...(origin as any));
        } else {
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
export function assertUnreachable(x: never): never
{
    throw new Error(`Unexpected object: ${x}`);
}


/// Type extensions
declare global
{
    /// The Array.at method is not yet supported by TypeScript.
    interface Array<T>
    {
        at(index: number): T;
    }

    /// Extract the K from Map<K,V>.
    type KeyOf<T> = T extends Map<infer I, any> ? I : never;

    /// Extract the V from Map<K,V> or Record<K,V>.
    type ValueOf<T> =
        T extends Map<any, infer I> ? I :
        T extends Record<string, infer I> ? I :
        never;

    /// Turns a ReadonlyMap<K,V> into a Map<K,V>.
    type MutableMap<T> = Map<
        T extends ReadonlyMap<infer I, any> ? I : never,
        T extends ReadonlyMap<any, infer I> ? I : never>;

    /// At least one, but can be more. Never empty.
    type Some<T> = [T, ...T[]];

    /// A sequence needs at least two elements.
    type Sequence<T> = [T, T, ...T[]];

    /// A fixed-size Array type.
    /// See https://stackoverflow.com/a/52490977
    type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
    type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

    /// A type that can be used to create a new instance. For example a class.
    type Type<T> = { new(...args: any[]): T; };

    /// Helper types for Branded types.
    /// Use to create a new type that is a subtype of `T` and is distinguishable
    /// from `T` by the type`B`.
    /// Example:
    /// ```typescript
    ///     type Email = Branded<string, "Email">;
    ///     function sendEmail(email: Email) { ... }
    ///     sendEmail("test") // Error
    ///     sendEmail("test" as Email) // OK
    /// ```
    /// See https://egghead.io/blog/using-branded-types-in-typescript
    type Branded<T, B> = T & Brand<B>;

    /// Extract a data-only subset of a (class) type.
    type DataOnly<T> = Pick<T, {
        [K in keyof T]: T[K] extends Function ? never : K;
    }[keyof T]>;
}

/// See `Branded<T, B>` for more information.
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B; };
