import { EPSILON } from "./common.js";
export class Vec3 {
    x;
    y;
    z;
    // Static methods ----------------------------------------------------------
    /// A Vec3 with x, y and z set to 0.
    static zero() {
        return new Vec3(0, 0, 0);
    }
    /// A Vec3 with x, y and z set to n.
    static all(n) {
        return new Vec3(n, n, n);
    }
    /// A random Vec3 with x, y and z in the range [0, 1).
    static random() {
        return new Vec3(Math.random(), Math.random(), Math.random());
    }
    /// A normalized Vec3 along the positive x-axis.
    static xAxis() {
        return new Vec3(1, 0, 0);
    }
    /// A normalized Vec3 along the positive y-axis.
    static yAxis() {
        return new Vec3(0, 1, 0);
    }
    /// A normalized Vec3 along the positive z-axis.
    static zAxis() {
        return new Vec3(0, 0, 1);
    }
    /// A random Vec3 with unit magnitude.
    static randomDir() {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const z = Math.random() * 2 - 1;
        const mag = Math.hypot(x, y, z);
        return new Vec3(x / mag, y / mag, z / mag);
    }
    /// A Vec3 with x, y and z initialized from the given array at the given offset.
    static fromArray(array, offset = 0) {
        return new Vec3(array[offset], array[offset + 1], array[offset + 2]);
    }
    /// A Vec3 from the given spherical coordinates.
    static fromSpherical(theta, phi, radius = 1) {
        const sinPhiRadius = Math.sin(phi) * radius;
        return new Vec3(sinPhiRadius * Math.sin(theta), Math.cos(phi) * radius, sinPhiRadius * Math.cos(theta));
    }
    /// A Vec3 from the given cylindrical coordinates.
    static fromCylindrical(theta, y, radius = 1) {
        return new Vec3(Math.sin(theta) * radius, y, Math.cos(theta) * radius);
    }
    /// The sum of a and b.
    static sumOf(a, b) {
        return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    /// The difference of a and b.
    static differenceOf(a, b) {
        return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    /// The component-wise product of a and b.
    static productOf(a, b) {
        return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
    }
    /// The component-wise quotient of a and b.
    static quotientOf(a, b) {
        return new Vec3(a.x / b.x, a.y / b.y, a.z / b.z);
    }
    /// A scaled copy of the given Vec3.
    static scaled(v, scalar) {
        return new Vec3(v.x * scalar, v.y * scalar, v.z * scalar);
    }
    /// Normal of a.
    static normalOf(a) {
        const magSq = a.x * a.x + a.y * a.y;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            return new Vec3(a.x * invMag, a.y * invMag, a.z * invMag);
        }
        else {
            return new Vec3(0, 0, 0);
        }
    }
    /// The component-wise min of a and b.
    static minOf(a, b) {
        return new Vec3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }
    /// The component-wise max of a and b.
    static maxOf(a, b) {
        return new Vec3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
    }
    // Instance methods --------------------------------------------------------
    /// Defaults to the zero vector.
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get 0() { return this.x; }
    set 0(value) { this.x = value; }
    get 1() { return this.y; }
    set 1(value) { this.y = value; }
    get 2() { return this.z; }
    set 2(value) { this.z = value; }
    get length() { return 3; }
    /// Alternative names for the components
    get width() { return this.x; }
    set width(value) { this.x = value; }
    get height() { return this.y; }
    set height(value) { this.y = value; }
    get depth() { return this.z; }
    set depth(value) { this.z = value; }
    get r() { return this.x; }
    set r(value) { this.x = value; }
    get g() { return this.y; }
    set g(value) { this.y = value; }
    get b() { return this.z; }
    set b(value) { this.z = value; }
    get u() { return this.x; }
    set u(value) { this.x = value; }
    get v() { return this.y; }
    set v(value) { this.y = value; }
    get w() { return this.z; }
    set w(value) { this.z = value; }
    /// Get the value of the given component by index.
    getIndex(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            default:
                throw new Error(`Invalid Vec3 index: ${index}`);
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
            default:
                throw new Error(`Invalid Vec3 index: ${index}`);
        }
    }
    /// Update this Vec3's x, y and z from the given array at the given offset.
    fromArray(array, offset = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    }
    /// Write this Vec3's x, y and z to the given array at the given offset.
    toArray(array = null, offset = 0) {
        if (array === null) {
            array = new Array(3);
        }
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        return array;
    }
    /// A new Vec3 with values from this one.
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    /// Copy values from another Vec3 into this one.
    copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }
    /// Tests for equality between this Vec3 and another.
    equals(other, epsilon = EPSILON) {
        return (Math.abs(this.x - other.x) <= epsilon &&
            Math.abs(this.y - other.y) <= epsilon &&
            Math.abs(this.z - other.z) <= epsilon);
    }
    /// Tests if any component is non-zero.
    any() {
        return this.x != 0 || this.y != 0 || this.z != 0;
    }
    /// Set this Vec3's x, y and z.
    /// If only one argument is given, all components are set to that value.
    /// If only two arguments are given, x and y are set to those values and z is set to 0.
    set(x, y, z) {
        this.x = x;
        this.y = y ?? x;
        this.z = z ?? (y === undefined ? x : 0);
        return this;
    }
    /// Set this Vec3's x component.
    setX(x) {
        this.x = x;
        return this;
    }
    /// Set this Vec3's y component.
    setY(y) {
        this.y = y;
        return this;
    }
    /// Set this Vec3's z component.
    setZ(z) {
        this.z = z;
        return this;
    }
    /// Assign random values to this Vec3 in the range [0, 1).
    randomize() {
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();
        return this;
    }
    /// this += other
    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
    // this += Vec3(n, n, n)
    addAll(n) {
        this.x += n;
        this.y += n;
        this.z += n;
        return this;
    }
    /// this = a + b
    sumOf(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }
    /// this -= other
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }
    /// this -= Vec3(n, n, n)
    subtractAll(n) {
        this.x -= n;
        this.y -= n;
        this.z -= n;
        return this;
    }
    /// this = a - b
    differenceOf(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }
    /// this *= other
    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }
    /// this = a * b (component-wise)
    productOf(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }
    /// this /= other
    divideBy(other) {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }
    /// this = a / b
    quotientOf(a, b) {
        this.x = a.x / b.x;
        this.y = a.y / b.y;
        this.z = a.z / b.z;
        return this;
    }
    /// this *= scalar
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    /// this = 1/this (component-wise)
    invert() {
        this.x = this.x == 0 ? 0 : 1 / this.x;
        this.y = this.y == 0 ? 0 : 1 / this.y;
        this.z = this.z == 0 ? 0 : 1 / this.z;
        return this;
    }
    /// this = 1/other (component-wise)
    inverseOf(other) {
        this.x = other.x == 0 ? 0 : 1 / other.x;
        this.y = other.y == 0 ? 0 : 1 / other.y;
        this.z = other.z == 0 ? 0 : 1 / other.z;
        return this;
    }
    /// this += other * scalar
    addScaled(other, scalar) {
        this.x += other.x * scalar;
        this.y += other.y * scalar;
        this.z += other.z * scalar;
        return this;
    }
    /// Component-wise modulo of this by other.
    mod(other) {
        this.x %= other.x;
        this.y %= other.y;
        this.z %= other.z;
        return this;
    }
    /// Component-wise modulo of this by n.
    modAll(n) {
        this.x %= n;
        this.y %= n;
        this.z %= n;
        return this;
    }
    /// Linear interpolation between this and other.
    lerp(other, t) {
        this.x += (other.x - this.x) * t;
        this.y += (other.y - this.y) * t;
        this.z += (other.z - this.z) * t;
        return this;
    }
    /// Linear interpolation between a and b.
    lerpOf(a, b, t) {
        this.x = a.x + (b.x - a.x) * t;
        this.y = a.y + (b.y - a.y) * t;
        this.z = a.z + (b.z - a.z) * t;
        return this;
    }
    /// Spherical interpolation between this and other.
    slerp(other, t) {
        const ax = this.x, ay = this.y, az = this.z;
        const bx = other.x, by = other.y, bz = other.z;
        const angle = Math.acos(Math.min(Math.max(ax * bx + ay * by + ax * bz, -1), 1));
        const sinTotal = angle ? Math.sin(angle) : 1;
        const ratioA = Math.sin((1 - t) * angle) / sinTotal;
        const ratioB = Math.sin(t * angle) / sinTotal;
        this.x = ratioA * ax + ratioB * bx;
        this.y = ratioA * ay + ratioB * by;
        this.z = ratioA * ax + ratioB * bz;
        return this;
    }
    /// Spherical interpolation between a and b.
    slerpOf(a, b, t) {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;
        const angle = Math.acos(Math.min(Math.max(ax * bx + ay * by + ax * bz, -1), 1));
        const sinTotal = angle ? Math.sin(angle) : 1;
        const ratioA = Math.sin((1 - t) * angle) / sinTotal;
        const ratioB = Math.sin(t * angle) / sinTotal;
        this.x = ratioA * ax + ratioB * bx;
        this.y = ratioA * ay + ratioB * by;
        this.z = ratioA * ax + ratioB * bz;
        return this;
    }
    /// Hermite interpolation with two control points
    hermiteOf(a, b, c, d, t) {
        const tSq = t * t;
        const f1 = tSq * (2 * t - 3) + 1;
        const f2 = tSq * (t - 2) + t;
        const f3 = tSq * (t - 1);
        const f4 = tSq * (3 - 2 * t);
        this.x = a.x * f1 + b.x * f2 + c.x * f3 + d.x * f4;
        this.y = a.y * f1 + b.y * f2 + c.y * f3 + d.y * f4;
        this.z = a.z * f1 + b.z * f2 + c.z * f3 + d.z * f4;
        return this;
    }
    /// Bezier interpolation with two control points
    bezierOf(a, b, c, d, t) {
        const tSq = t * t, ti = 1 - t, tiSq = ti * ti;
        const t1 = tiSq * ti;
        const t2 = 3 * t * tiSq;
        const t3 = 3 * tSq * ti;
        const t4 = tSq * t;
        this.x = a.x * t1 + b.x * t2 + c.x * t3 + d.x * t4;
        this.y = a.y * t1 + b.y * t2 + c.y * t3 + d.y * t4;
        this.z = a.z * t1 + b.z * t2 + c.z * t3 + d.z * t4;
        return this;
    }
    /// Dot product of this and other.
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    /// Cross product of this and other.
    cross(other) {
        const ax = this.x, ay = this.y, az = this.z;
        const bx = other.x, by = other.y, bz = other.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }
    /// Cross product of a and b.
    crossOf(a, b) {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }
    /// Squared magnitude of this.
    magSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /// Magnitude (length) of this.
    magnitude() {
        return Math.hypot(this.x, this.y, this.z);
    }
    /// Manhattan length of this.
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    /// Normalize this.
    normalize() {
        const magSq = this.x * this.x + this.y * this.y + this.z * this.z;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            this.x *= invMag;
            this.y *= invMag;
            this.z *= invMag;
        }
        return this;
    }
    /// Set this to the normalized value of other.
    normalOf(other) {
        const magSq = other.x * other.x + other.y * other.y + other.z * other.z;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            this.x = other.x * invMag;
            this.y = other.y * invMag;
            this.z = other.z * invMag;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }
    /// Distance from this to other.
    distanceTo(other) {
        return Math.hypot(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    /// Squared distance from this to other.
    distanceToSq(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return dx * dx + dy * dy + dz * dz;
    }
    /// Manhattan distance from this to other.
    manhattanDistanceTo(other) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y) + Math.abs(this.z - other.z);
    }
    /// Component-wise min of this and other.
    min(other) {
        this.x = Math.min(this.x, other.x);
        this.y = Math.min(this.y, other.y);
        this.z = Math.min(this.z, other.z);
        return this;
    }
    /// Component-wise min of a and b.
    minOf(a, b) {
        this.x = Math.min(a.x, b.x);
        this.y = Math.min(a.y, b.y);
        this.z = Math.min(a.z, b.z);
        return this;
    }
    /// Component-wise max of this and other.
    max(other) {
        this.x = Math.max(this.x, other.x);
        this.y = Math.max(this.y, other.y);
        this.z = Math.max(this.z, other.z);
        return this;
    }
    /// Component-wise max of a and b.
    maxOf(a, b) {
        this.x = Math.max(a.x, b.x);
        this.y = Math.max(a.y, b.y);
        this.z = Math.max(a.z, b.z);
        return this;
    }
    /// Component-wise clamp of this between min and max.
    clamp(min, max) {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this;
    }
    /// Clamp all components of this between min and max.
    clampScalar(min, max) {
        this.x = Math.max(min, Math.min(max, this.x));
        this.y = Math.max(min, Math.min(max, this.y));
        this.z = Math.max(min, Math.min(max, this.z));
        return this;
    }
    /// Clamp the magnitude of this between min and max.
    clampMagnitude(min, max) {
        const magSq = this.x * this.x + this.y * this.y + this.z * this.z;
        if (magSq > 0) {
            const mag = Math.sqrt(magSq);
            const factor = Math.max(min, Math.min(max, mag)) / mag;
            this.x *= factor;
            this.y *= factor;
            this.z *= factor;
        }
        return this;
    }
    /// Component-wise absolute value.
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        this.z = Math.abs(this.z);
        return this;
    }
    /// Component-wise absolute (floored) value.
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }
    /// Component-wise absolute (ceiled) value.
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }
    /// Component-wise absolute (rounded) value.
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }
    /// Component-wise absolute (truncated) value.
    trunc() {
        this.x = Math.trunc(this.x);
        this.y = Math.trunc(this.y);
        this.z = Math.trunc(this.z);
        return this;
    }
    /// Project this Vec3 onto the given Vec3.
    projectOnVector(other) {
        const bx = other.x, by = other.y, bz = other.z;
        const magSq = bx * bx + by * by + bz * bz;
        if (magSq == 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        else {
            const factor = (this.x * bx + this.y * by + this.z * bz) / magSq;
            this.x = bx * factor;
            this.y = by * factor;
            this.z = bz * factor;
        }
        return this;
    }
    /// Project this Vec3 onto the plane with the given normal.
    projectOnPlane(planeNormal) {
        const bx = planeNormal.x, by = planeNormal.y, bz = planeNormal.z;
        const factor = this.x * bx + this.y * by + this.z * bz;
        this.x -= bx * factor;
        this.y -= by * factor;
        this.z -= bz * factor;
        return this;
    }
    /// Reflect this Vec3 as incident off the plane with the given normal.
    reflect(normal) {
        const bx = normal.x, by = normal.y, bz = normal.z;
        const factor = 2 * (this.x * bx + this.y * by + this.z * bz);
        this.x -= bx * factor;
        this.y -= by * factor;
        this.z -= bz * factor;
        return this;
    }
    /// Angle of this Vec3 to other in radians.
    angleTo(other) {
        const ax = this.x, ay = this.y, az = this.z;
        const bx = other.x, by = other.y, bz = other.z;
        const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
        const cosine = mag && (ax * bx + ay * by + az * bz) / mag;
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
    }
    /// Rotate this Vec3 around the given axis by the given angle in radians.
    rotateAround(axis, angle) {
        const ax = this.x, ay = this.y, az = this.z;
        const bx = axis.x, by = axis.y, bz = axis.z;
        const cosine = Math.cos(angle), sine = Math.sin(angle);
        const factor = (bx * ax + by * ay + bz * az) * (1 - cosine);
        this.x = bx * factor + ax * cosine + (-bz * ay + by * az) * sine;
        this.y = by * factor + ay * cosine + (bz * ax - bx * az) * sine;
        this.z = bz * factor + az * cosine + (-by * ax + bx * ay) * sine;
        return this;
    }
    /// Translate this Vec3 along the positive x-axis by the given distance.
    translateX(distance) {
        this.x += distance;
        return this;
    }
    /// Translate this Vec3 along the positive y-axis by the given distance.
    translateY(distance) {
        this.y += distance;
        return this;
    }
    /// Translate this Vec3 along the positive z-axis by the given distance.
    translateZ(distance) {
        this.z += distance;
        return this;
    }
    /// Rotate this Vec3 around the positive x-axis by the given angle in radians.
    rotateX(radians) {
        const y = this.y, z = this.z;
        const c = Math.cos(radians), s = Math.sin(radians);
        this.y = y * c - z * s;
        this.z = y * s + z * c;
        return this;
    }
    /// Rotate this Vec3 around the positive y-axis by the given angle in radians.
    rotateY(radians) {
        const x = this.x, z = this.z;
        const c = Math.cos(radians), s = Math.sin(radians);
        this.x = x * c + z * s;
        this.z = -x * s + z * c;
        return this;
    }
    /// Rotate this Vec3 around the positive z-axis by the given angle in radians.
    rotateZ(radians) {
        const x = this.x, y = this.y;
        const c = Math.cos(radians), s = Math.sin(radians);
        this.x = x * c - y * s;
        this.y = x * s + y * c;
        return this;
    }
    /// Rotate this Vec3 with the given Mat3.
    applyMat3(m) {
        const x = this.x, y = this.y, z = this.z;
        this.x = x * m.a + y * m.d + z * m.g;
        this.y = x * m.b + y * m.e + z * m.h;
        this.z = x * m.c + y * m.f + z * m.i;
        return this;
    }
    /// Transform this Vec3 with the given Mat4.
    applyMat4(m) {
        const x = this.x, y = this.y, z = this.z;
        const w = (m.d * x + m.h * y + m.l * z + m.p) || 1;
        this.x = (x * m.a + y * m.e + z * m.i + m.m) / w;
        this.y = (x * m.b + y * m.f + z * m.j + m.n) / w;
        this.z = (x * m.c + y * m.g + z * m.k + m.o) / w;
        return this;
    }
    /// Rotate this Vec3 with the given Mat4 (translation is ignored).
    rotateMat4(m) {
        const x = this.x, y = this.y, z = this.z;
        this.x = x * m.a + y * m.e + z * m.i;
        this.y = x * m.b + y * m.f + z * m.j;
        this.z = x * m.c + y * m.g + z * m.k;
        return this;
    }
    /// Rotate this Vec3 with the given Quaternion.
    rotateQuat(q) {
        const vx = this.x, vy = this.y, vz = this.z;
        const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
        const tx = 2 * (qy * vz - qz * vy);
        const ty = 2 * (qz * vx - qx * vz);
        const tz = 2 * (qx * vy - qy * vx);
        this.x = vx + qw * tx + qy * tz - qz * ty;
        this.y = vy + qw * ty + qz * tx - qx * tz;
        this.z = vz + qw * tz + qx * ty - qy * tx;
        return this;
    }
    /// Allows the use of Vec3 in a for-of loop.
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}
// This is used to identify Vec3 objects in the code.
// It is stored as a property on the prototype so that does not take up
// any space in the actual object, but one can still access it.
Vec3.prototype.isVec3 = true;
/// This is to identify any glance math primitive in the code.
Vec3.prototype.isMathPrimitive = true;
