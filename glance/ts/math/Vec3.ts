import { EPSILON } from "./common.js";
import type { Mat3 } from "./Mat3.js";
import type { Mat4 } from "./Mat4.js";
import type { Quat } from "./Quat.js";

export class Vec3
{
    public x: number;
    public y: number;
    public z: number;

    // Static methods ----------------------------------------------------------

    /// A Vec3 with x, y and z set to 0.
    public static zero(): Vec3
    {
        return new Vec3(0, 0, 0);
    }

    /// A Vec3 with x, y and z set to n.
    public static all(n: number): Vec3
    {
        return new Vec3(n, n, n);
    }

    /// A random Vec3 with x, y and z in the range [0, 1).
    public static random(): Vec3
    {
        return new Vec3(Math.random(), Math.random(), Math.random());
    }

    /// A normalized Vec3 along the positive x-axis.
    public static xAxis(): Vec3
    {
        return new Vec3(1, 0, 0);
    }

    /// A normalized Vec3 along the positive y-axis.
    public static yAxis(): Vec3
    {
        return new Vec3(0, 1, 0);
    }

    /// A normalized Vec3 along the positive z-axis.
    public static zAxis(): Vec3
    {
        return new Vec3(0, 0, 1);
    }

    /// A random Vec3 with unit magnitude.
    public static randomDir(): Vec3
    {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const z = Math.random() * 2 - 1;
        const mag = Math.hypot(x, y, z);
        return new Vec3(x / mag, y / mag, z / mag);
    }

    /// A Vec3 with x, y and z initialized from the given array at the given offset.
    public static fromArray(array: Array<number>, offset: number = 0): Vec3
    {
        return new Vec3(array[offset], array[offset + 1], array[offset + 2]);
    }

    /// A Vec3 from the given spherical coordinates.
    public static fromSpherical(theta: number, phi: number, radius: number = 1): Vec3
    {
        const sinPhiRadius = Math.sin(phi) * radius;
        return new Vec3(
            sinPhiRadius * Math.sin(theta),
            Math.cos(phi) * radius,
            sinPhiRadius * Math.cos(theta)
        );
    }

    /// A Vec3 from the given cylindrical coordinates.
    public static fromCylindrical(theta: number, y: number, radius: number = 1): Vec3
    {
        return new Vec3(
            Math.sin(theta) * radius,
            y,
            Math.cos(theta) * radius
        );
    }

    /// The sum of a and b.
    public static sumOf(a: Vec3, b: Vec3): Vec3
    {
        return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    /// The difference of a and b.
    public static differenceOf(a: Vec3, b: Vec3): Vec3
    {
        return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    /// The component-wise product of a and b.
    public static productOf(a: Vec3, b: Vec3): Vec3
    {
        return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    /// The component-wise quotient of a and b.
    public static quotientOf(a: Vec3, b: Vec3): Vec3
    {
        return new Vec3(a.x / b.x, a.y / b.y, a.z / b.z);
    }

    /// A scaled copy of the given Vec3.
    public static scaled(v: Vec3, scalar: number): Vec3
    {
        return new Vec3(v.x * scalar, v.y * scalar, v.z * scalar);
    }

    /// Normal of a.
    public static normalOf(a: Vec3): Vec3
    {
        const magSq = a.x * a.x + a.y * a.y;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            return new Vec3(a.x * invMag, a.y * invMag, a.z * invMag);
        } else {
            return new Vec3(0, 0, 0);
        }
    }

    /// The component-wise min of a and b.
    public static minOf(a: Vec3, b: Vec3): Vec3
    {
        return new Vec3(
            Math.min(a.x, b.x),
            Math.min(a.y, b.y),
            Math.min(a.z, b.z)
        );
    }

    /// The component-wise max of a and b.
    public static maxOf(a: Vec3, b: Vec3): Vec3
    {
        return new Vec3(
            Math.max(a.x, b.x),
            Math.max(a.y, b.y),
            Math.max(a.z, b.z)
        );
    }

    // Instance methods --------------------------------------------------------

    /// Defaults to the zero vector.
    constructor(x: number = 0, y: number = 0, z: number = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /// Get the value of the given component.
    [index: number]: number;
    get 0(): number { return this.x; }
    set 0(value: number) { this.x = value; }
    get 1(): number { return this.y; }
    set 1(value: number) { this.y = value; }
    get 2(): number { return this.z; }
    set 2(value: number) { this.z = value; }
    get length(): number { return 3; }

    /// Alternative names for the components
    get width(): number { return this.x; }
    set width(value: number) { this.x = value; }
    get height(): number { return this.y; }
    set height(value: number) { this.y = value; }
    get depth(): number { return this.z; }
    set depth(value: number) { this.z = value; }

    get r(): number { return this.x; }
    set r(value: number) { this.x = value; }
    get g(): number { return this.y; }
    set g(value: number) { this.y = value; }
    get b(): number { return this.z; }
    set b(value: number) { this.z = value; }

    get u(): number { return this.x; }
    set u(value: number) { this.x = value; }
    get v(): number { return this.y; }
    set v(value: number) { this.y = value; }
    get w(): number { return this.z; }
    set w(value: number) { this.z = value; }

    /// Get the value of the given component by index.
    public getIndex(index: number): number
    {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            default:
                throw new Error(`Invalid Vec3 index: ${index}`);
        }
    }

    /// Set the value of the given component by index.
    public setIndex(index: number, value: number): void
    {
        switch (index) {
            case 0: this.x = value; break;
            case 1: this.y = value; break;
            case 2: this.z = value; break;
            default:
                throw new Error(`Invalid Vec3 index: ${index}`);
        }
    }

    /// Update this Vec3's x, y and z from the given array at the given offset.
    public fromArray(array: Array<number>, offset: number = 0): Vec3
    {
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    }

    /// Write this Vec3's x, y and z to the given array at the given offset.
    public toArray(array: Array<number> | null = null, offset: number = 0): Array<number>
    {
        if (array === null) {
            array = new Array<number>(3);
        }
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        return array;
    }

    /// A new Vec3 with values from this one.
    public clone(): Vec3
    {
        return new Vec3(this.x, this.y, this.z);
    }

    /// Copy values from another Vec3 into this one.
    public copy(other: Vec3): Vec3
    {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }

    /// Tests for equality between this Vec3 and another.
    public equals(other: Vec3, epsilon: number = EPSILON): boolean
    {
        return (
            Math.abs(this.x - other.x) <= epsilon &&
            Math.abs(this.y - other.y) <= epsilon &&
            Math.abs(this.z - other.z) <= epsilon);
    }

    /// Tests if any component is non-zero.
    public any(): boolean
    {
        return this.x != 0 || this.y != 0 || this.z != 0;
    }

    /// Set this Vec3's x, y and z.
    /// If only one argument is given, all components are set to that value.
    /// If only two arguments are given, x and y are set to those values and z is set to 0.
    public set(x: number, y?: number, z?: number): Vec3
    {
        this.x = x;
        this.y = y ?? x;
        this.z = z ?? (y === undefined ? x : 0);
        return this;
    }

    /// Set this Vec3's x component.
    public setX(x: number): Vec3
    {
        this.x = x;
        return this;
    }

    /// Set this Vec3's y component.
    public setY(y: number): Vec3
    {
        this.y = y;
        return this;
    }

    /// Set this Vec3's z component.
    public setZ(z: number): Vec3
    {
        this.z = z;
        return this;
    }

    /// Assign random values to this Vec3 in the range [0, 1).
    public randomize(): Vec3
    {
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();
        return this;
    }

    /// this += other
    public add(other: Vec3): Vec3
    {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    // this += Vec3(n, n, n)
    public addAll(n: number): Vec3
    {
        this.x += n;
        this.y += n;
        this.z += n;
        return this;
    }

    /// this = a + b
    public sumOf(a: Vec3, b: Vec3): Vec3
    {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }

    /// this -= other
    public subtract(other: Vec3): Vec3
    {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    /// this -= Vec3(n, n, n)
    public subtractAll(n: number): Vec3
    {
        this.x -= n;
        this.y -= n;
        this.z -= n;
        return this;
    }

    /// this = a - b
    public differenceOf(a: Vec3, b: Vec3): Vec3
    {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }

    /// this *= other
    public multiply(other: Vec3): Vec3
    {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }

    /// this = a * b (component-wise)
    public productOf(a: Vec3, b: Vec3): Vec3
    {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }

    /// this /= other
    public divideBy(other: Vec3): Vec3
    {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }

    /// this = a / b
    public quotientOf(a: Vec3, b: Vec3): Vec3
    {
        this.x = a.x / b.x;
        this.y = a.y / b.y;
        this.z = a.z / b.z;
        return this;
    }

    /// this *= scalar
    public scale(scalar: number): Vec3
    {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    /// this = 1/this (component-wise)
    public invert(): Vec3
    {
        this.x = this.x == 0 ? 0 : 1 / this.x;
        this.y = this.y == 0 ? 0 : 1 / this.y;
        this.z = this.z == 0 ? 0 : 1 / this.z;
        return this;
    }

    /// this = 1/other (component-wise)
    public inverseOf(other: Vec3): Vec3
    {
        this.x = other.x == 0 ? 0 : 1 / other.x;
        this.y = other.y == 0 ? 0 : 1 / other.y;
        this.z = other.z == 0 ? 0 : 1 / other.z;
        return this;
    }

    /// this += other * scalar
    public addScaled(other: Vec3, scalar: number): Vec3
    {
        this.x += other.x * scalar;
        this.y += other.y * scalar;
        this.z += other.z * scalar;
        return this;
    }

    /// Component-wise modulo of this by other.
    public mod(other: Vec3): Vec3
    {
        this.x %= other.x;
        this.y %= other.y;
        this.z %= other.z;
        return this;
    }

    /// Component-wise modulo of this by n.
    public modAll(n: number): Vec3
    {
        this.x %= n;
        this.y %= n;
        this.z %= n;
        return this;
    }

    /// Linear interpolation between this and other.
    public lerp(other: Vec3, t: number): Vec3
    {
        this.x += (other.x - this.x) * t;
        this.y += (other.y - this.y) * t;
        this.z += (other.z - this.z) * t;
        return this;
    }

    /// Linear interpolation between a and b.
    public lerpOf(a: Vec3, b: Vec3, t: number): Vec3
    {
        this.x = a.x + (b.x - a.x) * t;
        this.y = a.y + (b.y - a.y) * t;
        this.z = a.z + (b.z - a.z) * t;
        return this;
    }

    /// Spherical interpolation between this and other.
    public slerp(other: Vec3, t: number)
    {
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
    public slerpOf(a: Vec3, b: Vec3, t: number)
    {
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
    public hermiteOf(a: Vec3, b: Vec3, c: Vec3, d: Vec3, t: number)
    {
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
    public bezierOf(a: Vec3, b: Vec3, c: Vec3, d: Vec3, t: number)
    {
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
    public dot(other: Vec3): number
    {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /// Cross product of this and other.
    public cross(other: Vec3): Vec3
    {
        const ax = this.x, ay = this.y, az = this.z;
        const bx = other.x, by = other.y, bz = other.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }

    /// Cross product of a and b.
    public crossOf(a: Vec3, b: Vec3): Vec3
    {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }

    /// Squared magnitude of this.
    public magSq(): number
    {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /// Magnitude (length) of this.
    public magnitude(): number
    {
        return Math.hypot(this.x, this.y, this.z);
    }

    /// Manhattan length of this.
    public manhattanLength(): number
    {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }

    /// Normalize this.
    public normalize(): Vec3
    {
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
    public normalOf(other: Vec3): Vec3
    {
        const magSq = other.x * other.x + other.y * other.y + other.z * other.z;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            this.x = other.x * invMag;
            this.y = other.y * invMag;
            this.z = other.z * invMag;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }

    /// Distance from this to other.
    public distanceTo(other: Vec3): number
    {
        return Math.hypot(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    /// Squared distance from this to other.
    public distanceToSq(other: Vec3): number
    {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return dx * dx + dy * dy + dz * dz;
    }

    /// Manhattan distance from this to other.
    public manhattanDistanceTo(other: Vec3): number
    {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y) + Math.abs(this.z - other.z);
    }

    /// Component-wise min of this and other.
    public min(other: Vec3): Vec3
    {
        this.x = Math.min(this.x, other.x);
        this.y = Math.min(this.y, other.y);
        this.z = Math.min(this.z, other.z);
        return this;
    }

    /// Component-wise min of a and b.
    public minOf(a: Vec3, b: Vec3): Vec3
    {
        this.x = Math.min(a.x, b.x);
        this.y = Math.min(a.y, b.y);
        this.z = Math.min(a.z, b.z);
        return this;
    }

    /// Component-wise max of this and other.
    public max(other: Vec3): Vec3
    {
        this.x = Math.max(this.x, other.x);
        this.y = Math.max(this.y, other.y);
        this.z = Math.max(this.z, other.z);
        return this;
    }

    /// Component-wise max of a and b.
    public maxOf(a: Vec3, b: Vec3): Vec3
    {
        this.x = Math.max(a.x, b.x);
        this.y = Math.max(a.y, b.y);
        this.z = Math.max(a.z, b.z);
        return this;
    }

    /// Component-wise clamp of this between min and max.
    public clamp(min: Vec3, max: Vec3): Vec3
    {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this;
    }

    /// Clamp all components of this between min and max.
    public clampScalar(min: number, max: number): Vec3
    {
        this.x = Math.max(min, Math.min(max, this.x));
        this.y = Math.max(min, Math.min(max, this.y));
        this.z = Math.max(min, Math.min(max, this.z));
        return this;
    }

    /// Clamp the magnitude of this between min and max.
    public clampMagnitude(min: number, max: number): Vec3
    {
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
    public abs(): Vec3
    {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        this.z = Math.abs(this.z);
        return this;
    }

    /// Component-wise absolute (floored) value.
    public floor(): Vec3
    {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }

    /// Component-wise absolute (ceiled) value.
    public ceil(): Vec3
    {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }

    /// Component-wise absolute (rounded) value.
    public round(): Vec3
    {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }

    /// Component-wise absolute (truncated) value.
    public trunc(): Vec3
    {
        this.x = Math.trunc(this.x);
        this.y = Math.trunc(this.y);
        this.z = Math.trunc(this.z);
        return this;
    }

    /// Project this Vec3 onto the given Vec3.
    public projectOnVector(other: Vec3): Vec3
    {
        const bx = other.x, by = other.y, bz = other.z;
        const magSq = bx * bx + by * by + bz * bz;
        if (magSq == 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        } else {
            const factor = (this.x * bx + this.y * by + this.z * bz) / magSq;
            this.x = bx * factor;
            this.y = by * factor;
            this.z = bz * factor;
        }
        return this;
    }

    /// Project this Vec3 onto the plane with the given normal.
    public projectOnPlane(planeNormal: Vec3): Vec3
    {
        const bx = planeNormal.x, by = planeNormal.y, bz = planeNormal.z;
        const factor = this.x * bx + this.y * by + this.z * bz;
        this.x -= bx * factor;
        this.y -= by * factor;
        this.z -= bz * factor;
        return this;
    }

    /// Reflect this Vec3 as incident off the plane with the given normal.
    public reflect(normal: Vec3): Vec3
    {
        const bx = normal.x, by = normal.y, bz = normal.z;
        const factor = 2 * (this.x * bx + this.y * by + this.z * bz);
        this.x -= bx * factor;
        this.y -= by * factor;
        this.z -= bz * factor;
        return this;
    }

    /// Angle of this Vec3 to other in radians.
    public angleTo(other: Vec3): number
    {
        const ax = this.x, ay = this.y, az = this.z;
        const bx = other.x, by = other.y, bz = other.z;
        const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
        const cosine = mag && (ax * bx + ay * by + az * bz) / mag;
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
    }

    /// Rotate this Vec3 around the given axis by the given angle in radians.
    public rotateAround(axis: Vec3, angle: number): Vec3
    {
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
    public translateX(distance: number): Vec3
    {
        this.x += distance;
        return this;
    }

    /// Translate this Vec3 along the positive y-axis by the given distance.
    public translateY(distance: number): Vec3
    {
        this.y += distance;
        return this;
    }

    /// Translate this Vec3 along the positive z-axis by the given distance.
    public translateZ(distance: number): Vec3
    {
        this.z += distance;
        return this;
    }

    /// Rotate this Vec3 around the positive x-axis by the given angle in radians.
    public rotateX(radians: number): Vec3
    {
        const y = this.y, z = this.z;
        const c = Math.cos(radians), s = Math.sin(radians);
        this.y = y * c - z * s;
        this.z = y * s + z * c;
        return this;
    }

    /// Rotate this Vec3 around the positive y-axis by the given angle in radians.
    public rotateY(radians: number): Vec3
    {
        const x = this.x, z = this.z;
        const c = Math.cos(radians), s = Math.sin(radians);
        this.x = x * c + z * s;
        this.z = -x * s + z * c;
        return this;
    }

    /// Rotate this Vec3 around the positive z-axis by the given angle in radians.
    public rotateZ(radians: number): Vec3
    {
        const x = this.x, y = this.y;
        const c = Math.cos(radians), s = Math.sin(radians);
        this.x = x * c - y * s;
        this.y = x * s + y * c;
        return this;
    }

    /// Rotate this Vec3 with the given Mat3.
    public applyMat3(m: Mat3): Vec3
    {
        const x = this.x, y = this.y, z = this.z;
        this.x = x * m.a + y * m.d + z * m.g;
        this.y = x * m.b + y * m.e + z * m.h;
        this.z = x * m.c + y * m.f + z * m.i;
        return this;
    }

    /// Transform this Vec3 with the given Mat4.
    public applyMat4(m: Mat4): Vec3
    {
        const x = this.x, y = this.y, z = this.z;
        const w = (m.d * x + m.h * y + m.l * z + m.p) || 1;
        this.x = (x * m.a + y * m.e + z * m.i + m.m) / w;
        this.y = (x * m.b + y * m.f + z * m.j + m.n) / w;
        this.z = (x * m.c + y * m.g + z * m.k + m.o) / w;
        return this;
    }

    /// Rotate this Vec3 with the given Mat4 (translation is ignored).
    public rotateMat4(m: Mat4): Vec3
    {
        const x = this.x, y = this.y, z = this.z;
        this.x = x * m.a + y * m.e + z * m.i;
        this.y = x * m.b + y * m.f + z * m.j;
        this.z = x * m.c + y * m.g + z * m.k;
        return this;
    }

    /// Rotate this Vec3 with the given Quaternion.
    public rotateQuat(q: Quat): Vec3
    {
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
    *[Symbol.iterator](): Generator<number, void, unknown>
    {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}

// This is used to identify Vec3 objects in the code.
// It is stored as a property on the prototype so that does not take up
// any space in the actual object, but one can still access it.
(Vec3.prototype as any).isVec3 = true;

/// This is to identify any glance math primitive in the code.
(Vec3.prototype as any).isMathPrimitive = true;
