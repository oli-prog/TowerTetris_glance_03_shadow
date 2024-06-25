import { EPSILON } from "./common.js";
export class Vec2 {
    x;
    y;
    // Static methods ----------------------------------------------------------
    /// A Vec2 with x and y set to 0.
    static zero() {
        return new Vec2(0, 0);
    }
    /// A Vec2 with x and y set to n.
    static all(n) {
        return new Vec2(n, n);
    }
    /// A random Vec2 with x and y in the range [0, 1).
    static random() {
        return new Vec2(Math.random(), Math.random());
    }
    /// A normalized Vec2 along the positive x-axis.
    static xAxis() {
        return new Vec2(1, 0);
    }
    /// A normalized Vec2 along the positive y-axis.
    static yAxis() {
        return new Vec2(0, 1);
    }
    /// A random Vec2 with unit magnitude.
    static randomDir() {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const mag = Math.hypot(x, y);
        return new Vec2(x / mag, y / mag);
    }
    /// A Vec2 with x and y initialized from the given array at the given offset.
    static fromArray(array, offset = 0) {
        return new Vec2(array[offset], array[offset + 1]);
    }
    /// The sum of a and b.
    static sumOf(a, b) {
        return new Vec2(a.x + b.x, a.y + b.y);
    }
    /// The difference of a and b.
    static differenceOf(a, b) {
        return new Vec2(a.x - b.x, a.y - b.y);
    }
    /// The component-wise product of a and b.
    static productOf(a, b) {
        return new Vec2(a.x * b.x, a.y * b.y);
    }
    /// The component-wise quotient of a and b.
    static quotientOf(a, b) {
        return new Vec2(a.x / b.x, a.y / b.y);
    }
    /// Normal of a.
    static normalOf(a) {
        const magSq = a.x * a.x + a.y * a.y;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            return new Vec2(a.x * invMag, a.y * invMag);
        }
        else {
            return new Vec2(0, 0);
        }
    }
    /// The component-wise min of a and b.
    static minOf(a, b) {
        return new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }
    /// The component-wise max of a and b.
    static maxOf(a, b) {
        return new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }
    // Instance methods --------------------------------------------------------
    /// Defaults to the zero vector.
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get 0() { return this.x; }
    set 0(value) { this.x = value; }
    get 1() { return this.y; }
    set 1(value) { this.y = value; }
    get length() { return 2; }
    /// Alternative names for the components
    get width() { return this.x; }
    set width(value) { this.x = value; }
    get height() { return this.y; }
    set height(value) { this.y = value; }
    get ratio() { return this.y === 0 ? 0 : this.x / this.y; }
    get u() { return this.x; }
    set u(value) { this.x = value; }
    get v() { return this.y; }
    set v(value) { this.y = value; }
    /// Get the value of the given component by index.
    getIndex(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            default:
                throw new Error(`Invalid Vec2 index: ${index}`);
        }
    }
    /// Set the value of the given component by index.
    setIndex(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            default:
                throw new Error(`Invalid Vec2 index: ${index}`);
        }
    }
    /// Update this Vec2's x and y from the given array at the given offset.
    fromArray(array, offset = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    }
    /// Write this Vec2's x and y to the given array at the given offset.
    toArray(array = null, offset = 0) {
        if (array === null) {
            array = new Array(2);
        }
        array[offset] = this.x;
        array[offset + 1] = this.y;
        return array;
    }
    /// A new Vec2 with values from this one.
    clone() {
        return new Vec2(this.x, this.y);
    }
    /// Copy values from another Vec2 into this one.
    copy(other) {
        this.x = other.x;
        this.y = other.y;
        return this;
    }
    /// Tests for equality between this Vec2 and another.
    equals(other, epsilon = EPSILON) {
        return (Math.abs(this.x - other.x) <= epsilon &&
            Math.abs(this.y - other.y) <= epsilon);
    }
    /// Tests if any component is non-zero.
    any() {
        return this.x != 0 || this.y != 0;
    }
    /// Set this Vec2's x and y.
    /// If y is not given, both x and y will be set to x.
    set(x, y) {
        this.x = x;
        this.y = y ?? x;
        return this;
    }
    /// Set this Vec2's x component.
    setX(x) {
        this.x = x;
        return this;
    }
    /// Set this Vec2's y component.
    setY(y) {
        this.y = y;
        return this;
    }
    /// Assign random values to this Vec2 in the range [0, 1).
    randomize() {
        this.x = Math.random();
        this.y = Math.random();
        return this;
    }
    /// this += other
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    // this += Vec2(n, n)
    addAll(n) {
        this.x += n;
        this.y += n;
        return this;
    }
    /// this = a + b
    sumOf(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }
    /// this -= other
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    /// this -= Vec2(n, n)
    subtractAll(n) {
        this.x -= n;
        this.y -= n;
        return this;
    }
    /// this = a - b
    differenceOf(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }
    /// this *= other
    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }
    /// this = a * b (component-wise)
    productOf(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        return this;
    }
    /// this /= other
    divideBy(other) {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }
    /// this = a / b
    quotientOf(a, b) {
        this.x = a.x / b.x;
        this.y = a.y / b.y;
        return this;
    }
    /// this *= scalar
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /// this = 1/this (component-wise)
    invert() {
        this.x = this.x == 0 ? 0 : 1 / this.x;
        this.y = this.y == 0 ? 0 : 1 / this.y;
        return this;
    }
    /// this = 1/other (component-wise)
    inverseOf(other) {
        this.x = other.x == 0 ? 0 : 1 / other.x;
        this.y = other.y == 0 ? 0 : 1 / other.y;
        return this;
    }
    /// this += other * scalar
    addScaled(other, scalar) {
        this.x += other.x * scalar;
        this.y += other.y * scalar;
        return this;
    }
    /// Component-wise modulo of this by other.
    mod(other) {
        this.x %= other.x;
        this.y %= other.y;
        return this;
    }
    /// Component-wise modulo of this by n.
    modAll(n) {
        this.x %= n;
        this.y %= n;
        return this;
    }
    /// Linear interpolation between this and other.
    lerp(other, t) {
        this.x += (other.x - this.x) * t;
        this.y += (other.y - this.y) * t;
        return this;
    }
    /// Linear interpolation between a and b.
    lerpOf(a, b, t) {
        this.x = a.x + (b.x - a.x) * t;
        this.y = a.y + (b.y - a.y) * t;
        return this;
    }
    /// Dot product of this and other.
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    /// Cross product of this and other.
    cross(other) {
        return this.x * other.y - this.y * other.x;
    }
    /// Squared magnitude of this.
    magSq() {
        return this.x * this.x + this.y * this.y;
    }
    /// Magnitude (length) of this.
    magnitude() {
        return Math.hypot(this.x, this.y);
    }
    /// Manhattan length of this.
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y);
    }
    /// Normalize this.
    normalize() {
        const magSq = this.x * this.x + this.y * this.y;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            this.x *= invMag;
            this.y *= invMag;
        }
        return this;
    }
    /// Set this to the normalized value of other.
    normalOf(other) {
        const magSq = other.x * other.x + other.y * other.y;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            this.x = other.x * invMag;
            this.y = other.y * invMag;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
        return this;
    }
    /// Distance from this to other.
    distanceTo(other) {
        return Math.hypot(this.x - other.x, this.y - other.y);
    }
    /// Squared distance from this to other.
    distanceToSq(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx * dx + dy * dy;
    }
    /// Manhattan distance from this to other.
    manhattanDistanceTo(other) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }
    /// Component-wise min of this and other.
    min(other) {
        this.x = Math.min(this.x, other.x);
        this.y = Math.min(this.y, other.y);
        return this;
    }
    /// Component-wise min of a and b.
    minOf(a, b) {
        this.x = Math.min(a.x, b.x);
        this.y = Math.min(a.y, b.y);
        return this;
    }
    /// Component-wise max of this and other.
    max(other) {
        this.x = Math.max(this.x, other.x);
        this.y = Math.max(this.y, other.y);
        return this;
    }
    /// Component-wise max of a and b.
    maxOf(a, b) {
        this.x = Math.max(a.x, b.x);
        this.y = Math.max(a.y, b.y);
        return this;
    }
    /// Component-wise clamp of this between min and max.
    clamp(min, max) {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        return this;
    }
    /// Clamp all components of this between min and max.
    clampScalar(min, max) {
        this.x = Math.max(min, Math.min(max, this.x));
        this.y = Math.max(min, Math.min(max, this.y));
        return this;
    }
    /// Clamp the magnitude of this between min and max.
    clampMagnitude(min, max) {
        const magSq = this.x * this.x + this.y * this.y;
        if (magSq > 0) {
            const mag = Math.sqrt(magSq);
            const factor = Math.max(min, Math.min(max, mag)) / mag;
            this.x *= factor;
            this.y *= factor;
        }
        return this;
    }
    /// Component-wise absolute value.
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
    /// Component-wise absolute (floored) value.
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    /// Component-wise absolute (ceiled) value.
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    /// Component-wise absolute (rounded) value.
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    /// Component-wise absolute (truncated) value.
    trunc() {
        this.x = Math.trunc(this.x);
        this.y = Math.trunc(this.y);
        return this;
    }
    /// Angle of this Vec2 to the positive x-axis in radians.
    angle() {
        return Math.atan2(this.y, this.x);
    }
    /// Angle between this Vec2 and other in radians.
    angleTo(other) {
        return Math.atan2(this.x * other.y - this.y * other.x, // this.cross(other)
        this.x * other.x + this.y * other.y // this.dot(other)
        );
    }
    /// Rotate this Vec2 by the given angle in radians around the origin.
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x;
        const y = this.y;
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    }
    /// Rotate this Vec2 by the given angle in radians around the given pivot.
    rotateAround(angle, pivot) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x - pivot.x;
        const y = this.y - pivot.y;
        this.x = x * cos - y * sin + pivot.x;
        this.y = x * sin + y * cos + pivot.y;
        return this;
    }
    /// Translate this Vec2 along the positive x-axis by the given distance.
    translateX(distance) {
        this.x += distance;
        return this;
    }
    /// Translate this Vec2 along the positive y-axis by the given distance.
    translateY(distance) {
        this.y += distance;
        return this;
    }
    /// Transform this Vec2 by the given Mat3.
    applyMat3(mat) {
        const x = this.x;
        const y = this.y;
        this.x = x * mat.a + y * mat.d + mat.g;
        this.y = x * mat.b + y * mat.e + mat.h;
        return this;
    }
    /// Allows the use of Vec2 in a for-of loop.
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
}
// This is used to identify Vec2 objects in the code.
// It is stored as a property on the prototype so that does not take up
// any space in the actual object, but one can still access it.
Vec2.prototype.isVec2 = true;
/// This is to identify any glance math primitive in the code.
Vec2.prototype.isMathPrimitive = true;
