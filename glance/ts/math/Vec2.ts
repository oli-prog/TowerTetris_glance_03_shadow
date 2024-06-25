import { EPSILON } from "./common.js";
import type { Mat3 } from "./Mat3.js";

export class Vec2
{
    public x: number;
    public y: number;

    // Static methods ----------------------------------------------------------

    /// A Vec2 with x and y set to 0.
    public static zero(): Vec2
    {
        return new Vec2(0, 0);
    }

    /// A Vec2 with x and y set to n.
    public static all(n: number): Vec2
    {
        return new Vec2(n, n);
    }

    /// A random Vec2 with x and y in the range [0, 1).
    public static random(): Vec2
    {
        return new Vec2(Math.random(), Math.random());
    }

    /// A normalized Vec2 along the positive x-axis.
    public static xAxis(): Vec2
    {
        return new Vec2(1, 0);
    }

    /// A normalized Vec2 along the positive y-axis.
    public static yAxis(): Vec2
    {
        return new Vec2(0, 1);
    }

    /// A random Vec2 with unit magnitude.
    public static randomDir(): Vec2
    {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const mag = Math.hypot(x, y);
        return new Vec2(x / mag, y / mag);
    }

    /// A Vec2 with x and y initialized from the given array at the given offset.
    public static fromArray(array: Array<number>, offset: number = 0): Vec2
    {
        return new Vec2(array[offset], array[offset + 1]);
    }

    /// The sum of a and b.
    public static sumOf(a: Vec2, b: Vec2): Vec2
    {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    /// The difference of a and b.
    public static differenceOf(a: Vec2, b: Vec2): Vec2
    {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    /// The component-wise product of a and b.
    public static productOf(a: Vec2, b: Vec2): Vec2
    {
        return new Vec2(a.x * b.x, a.y * b.y);
    }

    /// The component-wise quotient of a and b.
    public static quotientOf(a: Vec2, b: Vec2): Vec2
    {
        return new Vec2(a.x / b.x, a.y / b.y);
    }

    /// Normal of a.
    public static normalOf(a: Vec2): Vec2
    {
        const magSq = a.x * a.x + a.y * a.y;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            return new Vec2(a.x * invMag, a.y * invMag);
        } else {
            return new Vec2(0, 0);
        }
    }

    /// The component-wise min of a and b.
    public static minOf(a: Vec2, b: Vec2): Vec2
    {
        return new Vec2(
            Math.min(a.x, b.x),
            Math.min(a.y, b.y)
        );
    }

    /// The component-wise max of a and b.
    public static maxOf(a: Vec2, b: Vec2): Vec2
    {
        return new Vec2(
            Math.max(a.x, b.x),
            Math.max(a.y, b.y)
        );
    }

    // Instance methods --------------------------------------------------------

    /// Defaults to the zero vector.
    constructor(x: number = 0, y: number = 0)
    {
        this.x = x;
        this.y = y;
    }

    /// Get the x or y component by index.
    [index: number]: number;
    get 0(): number { return this.x; }
    set 0(value: number) { this.x = value; }
    get 1(): number { return this.y; }
    set 1(value: number) { this.y = value; }
    get length(): number { return 2; }

    /// Alternative names for the components
    get width(): number { return this.x; }
    set width(value: number) { this.x = value; }
    get height(): number { return this.y; }
    set height(value: number) { this.y = value; }
    get ratio(): number { return this.y === 0 ? 0 : this.x / this.y; }

    get u(): number { return this.x; }
    set u(value: number) { this.x = value; }
    get v(): number { return this.y; }
    set v(value: number) { this.y = value; }

    /// Get the value of the given component by index.
    public getIndex(index: number): number
    {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            default:
                throw new Error(`Invalid Vec2 index: ${index}`);
        }
    }

    /// Set the value of the given component by index.
    public setIndex(index: number, value: number): void
    {
        switch (index) {
            case 0: this.x = value; break;
            case 1: this.y = value; break;
            default:
                throw new Error(`Invalid Vec2 index: ${index}`);
        }
    }

    /// Update this Vec2's x and y from the given array at the given offset.
    public fromArray(array: Array<number>, offset: number = 0): Vec2
    {
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    }

    /// Write this Vec2's x and y to the given array at the given offset.
    public toArray(array: Array<number> | null = null, offset: number = 0): Array<number>
    {
        if (array === null) {
            array = new Array<number>(2);
        }
        array[offset] = this.x;
        array[offset + 1] = this.y;
        return array;
    }

    /// A new Vec2 with values from this one.
    public clone(): Vec2
    {
        return new Vec2(this.x, this.y);
    }

    /// Copy values from another Vec2 into this one.
    public copy(other: Vec2): Vec2
    {
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    /// Tests for equality between this Vec2 and another.
    public equals(other: Vec2, epsilon: number = EPSILON): boolean
    {
        return (
            Math.abs(this.x - other.x) <= epsilon &&
            Math.abs(this.y - other.y) <= epsilon);
    }

    /// Tests if any component is non-zero.
    public any(): boolean
    {
        return this.x != 0 || this.y != 0;
    }

    /// Set this Vec2's x and y.
    /// If y is not given, both x and y will be set to x.
    public set(x: number, y?: number): Vec2
    {
        this.x = x;
        this.y = y ?? x;
        return this;
    }

    /// Set this Vec2's x component.
    public setX(x: number): Vec2
    {
        this.x = x;
        return this;
    }

    /// Set this Vec2's y component.
    public setY(y: number): Vec2
    {
        this.y = y;
        return this;
    }

    /// Assign random values to this Vec2 in the range [0, 1).
    public randomize(): Vec2
    {
        this.x = Math.random();
        this.y = Math.random();
        return this;
    }

    /// this += other
    public add(other: Vec2): Vec2
    {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    // this += Vec2(n, n)
    public addAll(n: number): Vec2
    {
        this.x += n;
        this.y += n;
        return this;
    }

    /// this = a + b
    public sumOf(a: Vec2, b: Vec2): Vec2
    {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }

    /// this -= other
    public subtract(other: Vec2): Vec2
    {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    /// this -= Vec2(n, n)
    public subtractAll(n: number): Vec2
    {
        this.x -= n;
        this.y -= n;
        return this;
    }

    /// this = a - b
    public differenceOf(a: Vec2, b: Vec2): Vec2
    {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }

    /// this *= other
    public multiply(other: Vec2): Vec2
    {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }

    /// this = a * b (component-wise)
    public productOf(a: Vec2, b: Vec2): Vec2
    {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        return this;
    }

    /// this /= other
    public divideBy(other: Vec2): Vec2
    {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }

    /// this = a / b
    public quotientOf(a: Vec2, b: Vec2): Vec2
    {
        this.x = a.x / b.x;
        this.y = a.y / b.y;
        return this;
    }

    /// this *= scalar
    public scale(scalar: number): Vec2
    {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /// this = 1/this (component-wise)
    public invert(): Vec2
    {
        this.x = this.x == 0 ? 0 : 1 / this.x;
        this.y = this.y == 0 ? 0 : 1 / this.y;
        return this;
    }

    /// this = 1/other (component-wise)
    public inverseOf(other: Vec2): Vec2
    {
        this.x = other.x == 0 ? 0 : 1 / other.x;
        this.y = other.y == 0 ? 0 : 1 / other.y;
        return this;
    }

    /// this += other * scalar
    public addScaled(other: Vec2, scalar: number): Vec2
    {
        this.x += other.x * scalar;
        this.y += other.y * scalar;
        return this;
    }

    /// Component-wise modulo of this by other.
    public mod(other: Vec2): Vec2
    {
        this.x %= other.x;
        this.y %= other.y;
        return this;
    }

    /// Component-wise modulo of this by n.
    public modAll(n: number): Vec2
    {
        this.x %= n;
        this.y %= n;
        return this;
    }

    /// Linear interpolation between this and other.
    public lerp(other: Vec2, t: number): Vec2
    {
        this.x += (other.x - this.x) * t;
        this.y += (other.y - this.y) * t;
        return this;
    }

    /// Linear interpolation between a and b.
    public lerpOf(a: Vec2, b: Vec2, t: number): Vec2
    {
        this.x = a.x + (b.x - a.x) * t;
        this.y = a.y + (b.y - a.y) * t;
        return this;
    }

    /// Dot product of this and other.
    public dot(other: Vec2): number
    {
        return this.x * other.x + this.y * other.y;
    }

    /// Cross product of this and other.
    public cross(other: Vec2): number
    {
        return this.x * other.y - this.y * other.x;
    }

    /// Squared magnitude of this.
    public magSq(): number
    {
        return this.x * this.x + this.y * this.y;
    }

    /// Magnitude (length) of this.
    public magnitude(): number
    {
        return Math.hypot(this.x, this.y);
    }

    /// Manhattan length of this.
    public manhattanLength(): number
    {
        return Math.abs(this.x) + Math.abs(this.y);
    }

    /// Normalize this.
    public normalize(): Vec2
    {
        const magSq = this.x * this.x + this.y * this.y;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            this.x *= invMag;
            this.y *= invMag;
        }
        return this;
    }

    /// Set this to the normalized value of other.
    public normalOf(other: Vec2): Vec2
    {
        const magSq = other.x * other.x + other.y * other.y;
        if (magSq > 0) {
            const invMag = 1 / Math.sqrt(magSq);
            this.x = other.x * invMag;
            this.y = other.y * invMag;
        } else {
            this.x = 0;
            this.y = 0;
        }
        return this;
    }

    /// Distance from this to other.
    public distanceTo(other: Vec2): number
    {
        return Math.hypot(this.x - other.x, this.y - other.y);
    }

    /// Squared distance from this to other.
    public distanceToSq(other: Vec2): number
    {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx * dx + dy * dy;
    }

    /// Manhattan distance from this to other.
    public manhattanDistanceTo(other: Vec2): number
    {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    /// Component-wise min of this and other.
    public min(other: Vec2): Vec2
    {
        this.x = Math.min(this.x, other.x);
        this.y = Math.min(this.y, other.y);
        return this;
    }

    /// Component-wise min of a and b.
    public minOf(a: Vec2, b: Vec2): Vec2
    {
        this.x = Math.min(a.x, b.x);
        this.y = Math.min(a.y, b.y);
        return this;
    }

    /// Component-wise max of this and other.
    public max(other: Vec2): Vec2
    {
        this.x = Math.max(this.x, other.x);
        this.y = Math.max(this.y, other.y);
        return this;
    }

    /// Component-wise max of a and b.
    public maxOf(a: Vec2, b: Vec2): Vec2
    {
        this.x = Math.max(a.x, b.x);
        this.y = Math.max(a.y, b.y);
        return this;
    }

    /// Component-wise clamp of this between min and max.
    public clamp(min: Vec2, max: Vec2): Vec2
    {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        return this;
    }

    /// Clamp all components of this between min and max.
    public clampScalar(min: number, max: number): Vec2
    {
        this.x = Math.max(min, Math.min(max, this.x));
        this.y = Math.max(min, Math.min(max, this.y));
        return this;
    }

    /// Clamp the magnitude of this between min and max.
    public clampMagnitude(min: number, max: number): Vec2
    {
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
    public abs(): Vec2
    {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }

    /// Component-wise absolute (floored) value.
    public floor(): Vec2
    {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    /// Component-wise absolute (ceiled) value.
    public ceil(): Vec2
    {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    /// Component-wise absolute (rounded) value.
    public round(): Vec2
    {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    /// Component-wise absolute (truncated) value.
    public trunc(): Vec2
    {
        this.x = Math.trunc(this.x);
        this.y = Math.trunc(this.y);
        return this;
    }

    /// Angle of this Vec2 to the positive x-axis in radians.
    public angle(): number
    {
        return Math.atan2(this.y, this.x);
    }

    /// Angle between this Vec2 and other in radians.
    public angleTo(other: Vec2): number
    {
        return Math.atan2(
            this.x * other.y - this.y * other.x, // this.cross(other)
            this.x * other.x + this.y * other.y  // this.dot(other)
        );
    }

    /// Rotate this Vec2 by the given angle in radians around the origin.
    public rotate(angle: number): Vec2
    {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x;
        const y = this.y;
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    }

    /// Rotate this Vec2 by the given angle in radians around the given pivot.
    public rotateAround(angle: number, pivot: Vec2): Vec2
    {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x - pivot.x;
        const y = this.y - pivot.y;
        this.x = x * cos - y * sin + pivot.x;
        this.y = x * sin + y * cos + pivot.y;
        return this;
    }

    /// Translate this Vec2 along the positive x-axis by the given distance.
    public translateX(distance: number): Vec2
    {
        this.x += distance;
        return this;
    }

    /// Translate this Vec2 along the positive y-axis by the given distance.
    public translateY(distance: number): Vec2
    {
        this.y += distance;
        return this;
    }

    /// Transform this Vec2 by the given Mat3.
    public applyMat3(mat: Mat3): Vec2
    {
        const x = this.x;
        const y = this.y;
        this.x = x * mat.a + y * mat.d + mat.g;
        this.y = x * mat.b + y * mat.e + mat.h;
        return this;
    }

    /// Allows the use of Vec2 in a for-of loop.
    *[Symbol.iterator](): Generator<number, void, unknown>
    {
        yield this.x;
        yield this.y;
    }
}

// This is used to identify Vec2 objects in the code.
// It is stored as a property on the prototype so that does not take up
// any space in the actual object, but one can still access it.
(Vec2.prototype as any).isVec2 = true;

/// This is to identify any glance math primitive in the code.
(Vec2.prototype as any).isMathPrimitive = true;
