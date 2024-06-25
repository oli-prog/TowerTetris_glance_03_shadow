import { EPSILON } from "./common.js";
import { Vec3 } from "./Vec3.js";
export class Vec4 {
    x;
    y;
    z;
    w;
    // Static methods ----------------------------------------------------------
    /// A Vec4 with x, y and z set to 0.
    static zero() {
        return new Vec4(0, 0, 0, 0);
    }
    /// A Vec4 with x, y, z and w set to n.
    static all(n) {
        return new Vec4(n, n, n, n);
    }
    /// A random Vec4 with x, y, z and w in the range [0, 1).
    static random() {
        return new Vec4(Math.random(), Math.random(), Math.random(), Math.random());
    }
    /// A normalized Vec4 along the positive x-axis.
    static xAxis() {
        return new Vec4(1, 0, 0);
    }
    /// A normalized Vec4 along the positive y-axis.
    static yAxis() {
        return new Vec4(0, 1, 0);
    }
    /// A normalized Vec4 along the positive z-axis.
    static zAxis() {
        return new Vec4(0, 0, 1);
    }
    /// A random Vec4 with unit magnitude and w set to 0.
    static randomDir() {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const z = Math.random() * 2 - 1;
        const mag = Math.hypot(x, y, z);
        return new Vec4(x / mag, y / mag, z / mag, 0);
    }
    /// A Vec4 with x, y and z initialized from the given array at the given offset.
    static fromArray(array, offset = 0) {
        return new Vec4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
    }
    /// The sum of a and b.
    static sumOf(a, b) {
        return new Vec4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
    }
    /// The difference of a and b.
    static differenceOf(a, b) {
        return new Vec4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
    }
    /// The component-wise product of a and b.
    static productOf(a, b) {
        return new Vec4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
    }
    /// The component-wise quotient of a and b.
    static quotientOf(a, b) {
        return new Vec4(a.x / b.x, a.y / b.y, a.z / b.z, a.w / b.w);
    }
    /// The component-wise min of a and b.
    static minOf(a, b) {
        return new Vec4(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z), Math.min(a.w, b.w));
    }
    /// The component-wise max of a and b.
    static maxOf(a, b) {
        return new Vec4(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z), Math.max(a.w, b.w));
    }
    // Instance methods --------------------------------------------------------
    /// Defaults to the zero vector.
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    get 0() { return this.x; }
    set 0(value) { this.x = value; }
    get 1() { return this.y; }
    set 1(value) { this.y = value; }
    get 2() { return this.z; }
    set 2(value) { this.z = value; }
    get 3() { return this.w; }
    set 3(value) { this.w = value; }
    get length() { return 4; }
    /// Get the xyz part of this Vec4 as a Vec3.
    get xyz() {
        return new Vec3(this.x, this.y, this.z);
    }
    /// Get the value of the given component by index.
    getIndex(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            case 3: return this.w;
            default:
                throw new Error(`Invalid Vec4 index: ${index}`);
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
            case 2:
                this.z = value;
                break;
            case 3:
                this.w = value;
                break;
            default:
                throw new Error(`Invalid Vec4 index: ${index}`);
        }
    }
    /// Update this Vec4's x, y and z from the given array at the given offset.
    fromArray(array, offset = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        this.w = array[offset + 3];
        return this;
    }
    /// Write this Vec4's x, y and z to the given array at the given offset.
    toArray(array = null, offset = 0) {
        if (array === null) {
            array = new Array(3);
        }
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        array[offset + 3] = this.w;
        return array;
    }
    /// A new Vec4 with values from this one.
    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }
    /// Copy values from another Vec4 into this one.
    copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
        return this;
    }
    /// Tests for equality between this Vec4 and another.
    equals(other, epsilon = EPSILON) {
        return (Math.abs(this.x - other.x) <= epsilon &&
            Math.abs(this.y - other.y) <= epsilon &&
            Math.abs(this.z - other.z) <= epsilon &&
            Math.abs(this.w - other.w) <= epsilon);
    }
    /// Tests if any component is non-zero.
    any() {
        return this.x != 0 || this.y != 0 || this.z != 0 || this.w != 0;
    }
    /// Set this Vec4's x, y, z and w.
    /// If only one argument is given, all components are set to that value.
    /// If only two arguments are given, x and y are set to those values and z is set to 0.
    /// w is set to 1 if not given.
    set(x, y, z, w) {
        this.x = x;
        this.y = y ?? x;
        this.z = z ?? (y === undefined ? x : 0);
        this.w = w ?? 1;
        return this;
    }
    /// Set this Vec4's x component.
    setX(x) {
        this.x = x;
        return this;
    }
    /// Set this Vec4's y component.
    setY(y) {
        this.y = y;
        return this;
    }
    /// Set this Vec4's z component.
    setZ(z) {
        this.z = z;
        return this;
    }
    /// Set this Vec4's w component.
    setW(w) {
        this.w = w;
        return this;
    }
    /// Assign random values to this Vec4 in the range [0, 1).
    randomize() {
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();
        this.w = Math.random();
        return this;
    }
    /// this += other
    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        this.w += other.w;
        return this;
    }
    // this += Vec4(n, n, n, n)
    addAll(n) {
        this.x += n;
        this.y += n;
        this.z += n;
        this.w += n;
        return this;
    }
    /// this = a + b
    sumOf(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
    }
    /// this -= other
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        this.w -= other.w;
        return this;
    }
    // this -= Vec4(n, n, n, n)
    subtractAll(n) {
        this.x -= n;
        this.y -= n;
        this.z -= n;
        this.w -= n;
        return this;
    }
    /// this = a - b
    differenceOf(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
    }
    /// this *= other
    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        this.w *= other.w;
        return this;
    }
    /// this = a * b (component-wise)
    productOf(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        this.w = a.w * b.w;
        return this;
    }
    /// this /= other
    divideBy(other) {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        this.w /= other.w;
        return this;
    }
    /// this = a / b
    quotientOf(a, b) {
        this.x = a.x / b.x;
        this.y = a.y / b.y;
        this.z = a.z / b.z;
        this.w = a.w / b.w;
        return this;
    }
    /// this *= scalar
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.w *= scalar;
        return this;
    }
    /// Dot product of this and other.
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
    }
    /// this = 1/this (component-wise)
    invert() {
        this.x = this.x == 0 ? 0 : 1 / this.x;
        this.y = this.y == 0 ? 0 : 1 / this.y;
        this.z = this.z == 0 ? 0 : 1 / this.z;
        this.w = this.w == 0 ? 0 : 1 / this.w;
        return this;
    }
    /// this = 1/other (component-wise)
    inverseOf(other) {
        this.x = other.x == 0 ? 0 : 1 / other.x;
        this.y = other.y == 0 ? 0 : 1 / other.y;
        this.z = other.z == 0 ? 0 : 1 / other.z;
        this.w = other.w == 0 ? 0 : 1 / other.w;
        return this;
    }
    /// this += other * scalar
    addScaled(other, scalar) {
        this.x += other.x * scalar;
        this.y += other.y * scalar;
        this.z += other.z * scalar;
        this.w += other.w * scalar;
        return this;
    }
    /// Component-wise modulo of this by other.
    mod(other) {
        this.x %= other.x;
        this.y %= other.y;
        this.z %= other.z;
        this.w %= other.w;
        return this;
    }
    /// Component-wise modulo of this by n.
    modAll(n) {
        this.x %= n;
        this.y %= n;
        this.z %= n;
        this.w %= n;
        return this;
    }
    /// Linear interpolation between this and other.
    lerp(other, t) {
        this.x += (other.x - this.x) * t;
        this.y += (other.y - this.y) * t;
        this.z += (other.z - this.z) * t;
        this.w += (other.w - this.w) * t;
        return this;
    }
    /// Linear interpolation between a and b.
    lerpOf(a, b, t) {
        this.x = a.x + (b.x - a.x) * t;
        this.y = a.y + (b.y - a.y) * t;
        this.z = a.z + (b.z - a.z) * t;
        this.w = a.w + (b.w - a.w) * t;
        return this;
    }
    /// Squared magnitude of this.
    magSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    /// Magnitude (length) of this.
    magnitude() {
        return Math.hypot(this.x, this.y, this.z, this.w);
    }
    /// Manhattan length of this.
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }
    /// Normalize this.
    /// Unlike a Vec3 normalization, this just ensures that w is 1.
    normalize() {
        if (this.w !== 0) {
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
            this.w = 1;
        }
        return this;
    }
    /// Set this to the normalized value of other.
    normalOf(other) {
        if (other.w === 0) {
            this.x = other.x;
            this.y = other.y;
            this.z = other.z;
            this.w = other.w;
        }
        else {
            this.x /= other.w;
            this.y /= other.w;
            this.z /= other.w;
            this.w = 1;
        }
        return this;
    }
    /// Component-wise min of this and other.
    min(other) {
        if (typeof other === "number") {
            this.x = Math.min(this.x, other);
            this.y = Math.min(this.y, other);
            this.z = Math.min(this.z, other);
            this.w = Math.min(this.w, other);
        }
        else {
            this.x = Math.min(this.x, other.x);
            this.y = Math.min(this.y, other.y);
            this.z = Math.min(this.z, other.z);
            this.w = Math.min(this.w, other.w);
        }
        return this;
    }
    /// Component-wise min of a and b.
    minOf(a, b) {
        this.x = Math.min(a.x, b.x);
        this.y = Math.min(a.y, b.y);
        this.z = Math.min(a.z, b.z);
        this.w = Math.min(a.w, b.w);
        return this;
    }
    /// Component-wise max of this and other.
    max(other) {
        if (typeof other === "number") {
            this.x = Math.max(this.x, other);
            this.y = Math.max(this.y, other);
            this.z = Math.max(this.z, other);
            this.w = Math.max(this.w, other);
        }
        else {
            this.x = Math.max(this.x, other.x);
            this.y = Math.max(this.y, other.y);
            this.z = Math.max(this.z, other.z);
            this.w = Math.max(this.w, other.w);
        }
        return this;
    }
    /// Component-wise max of a and b.
    maxOf(a, b) {
        this.x = Math.max(a.x, b.x);
        this.y = Math.max(a.y, b.y);
        this.z = Math.max(a.z, b.z);
        this.w = Math.max(a.w, b.w);
        return this;
    }
    /// Component-wise clamp of this between min and max.
    clamp(min, max) {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        this.w = Math.max(min.w, Math.min(max.w, this.w));
        return this;
    }
    /// Clamp all components of this between min and max.
    clampScalar(min, max) {
        this.x = Math.max(min, Math.min(max, this.x));
        this.y = Math.max(min, Math.min(max, this.y));
        this.z = Math.max(min, Math.min(max, this.z));
        this.w = Math.max(min, Math.min(max, this.w));
        return this;
    }
    /// Component-wise absolute value.
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        this.z = Math.abs(this.z);
        this.w = Math.abs(this.w);
        return this;
    }
    /// Component-wise absolute (floored) value.
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        this.w = Math.floor(this.w);
        return this;
    }
    /// Component-wise absolute (ceiled) value.
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        this.w = Math.ceil(this.w);
        return this;
    }
    /// Component-wise absolute (rounded) value.
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        this.w = Math.round(this.w);
        return this;
    }
    /// Component-wise absolute (truncated) value.
    trunc() {
        this.x = Math.trunc(this.x);
        this.y = Math.trunc(this.y);
        this.z = Math.trunc(this.z);
        this.w = Math.trunc(this.w);
        return this;
    }
    /// Transform this Vec3 with the given Mat4.
    applyMat4(m) {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        this.x = x * m.a + y * m.e + z * m.i + w * m.m;
        this.y = x * m.b + y * m.f + z * m.j + w * m.n;
        this.z = x * m.c + y * m.g + z * m.k + w * m.o;
        this.w = x * m.d + y * m.h + z * m.l + w * m.p;
        return this;
    }
    /// Allows the use of Vec4 in a for-of loop.
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
        yield this.w;
    }
}
// This is used to identify Vec4 objects in the code.
// It is stored as a property on the prototype so that does not take up
// any space in the actual object, but one can still access it.
Vec4.prototype.isVec4 = true;
/// This is to identify any glance math primitive in the code.
Vec4.prototype.isMathPrimitive = true;
