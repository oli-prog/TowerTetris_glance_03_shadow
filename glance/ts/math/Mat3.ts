import { EPSILON } from "./common.js";
import type { Vec2 } from "./Vec2.js";
import type { Mat4 } from "./Mat4.js";

/// A 3x3 matrix.
/// The matrix is stored in column-major order:
///  | a d g |
///  | b e h |
///  | c f i |
export class Mat3
{
    // Amazingly, this is faster than using an Array or a Float32Array.
    public a: number; public b: number; public c: number;
    public d: number; public e: number; public f: number;
    public g: number; public h: number; public i: number;

    // Static methods ----------------------------------------------------------

    /// A Mat3 with all elements set to n.
    public static all(n: number): Mat3
    {
        return new Mat3(n, n, n, n, n, n, n, n, n);
    }

    /// A Mat3 with all elements set to a random value in the range [0, 1).
    public static random()
    {
        return new Mat3(
            Math.random(), Math.random(), Math.random(),
            Math.random(), Math.random(), Math.random(),
            Math.random(), Math.random(), Math.random(),
        );
    }

    /// A new Matrix with components initialized from the given array at the given offset.
    public static fromArray(array: Array<number>, offset: number = 0): Mat3
    {
        return new Mat3(
            array[offset + 0], array[offset + 1], array[offset + 2],
            array[offset + 3], array[offset + 4], array[offset + 5],
            array[offset + 6], array[offset + 7], array[offset + 8]);
    }

    /// The identity matrix.
    public static identity(): Mat3
    {
        return new Mat3();
    }

    /// A 2D translation matrix with the given Vec2.
    public static fromTranslation(v: Vec2): Mat3
    {
        return new Mat3(
            1, 0, 0,
            0, 1, 0,
            v.x, v.y, 1,
        );
    }

    /// A 2D translation matrix with the given distance along the x-axis.
    public static fromTranslationX(delta: number): Mat3
    {
        return new Mat3(
            1, 0, 0,
            0, 1, 0,
            delta, 0, 1,
        );
    }

    /// A 2D translation matrix with the given distance along the y-axis.
    public static fromTranslationY(delta: number): Mat3
    {
        return new Mat3(
            1, 0, 0,
            0, 1, 0,
            0, delta, 1,
        );
    }

    /// A 2D rotation matrix around the origin in radians.
    public static fromRotation(angle: number): Mat3
    {
        const s = Math.sin(angle), c = Math.cos(angle);
        return new Mat3(
            c, s, 0,
            -s, c, 0,
            0, 0, 1);
    }

    /// A 2D scale matrix with the given Vec2.
    public static fromScale(v: Vec2): Mat3
    {
        return new Mat3(
            v.x, 0, 0,
            0, v.y, 0,
            0, 0, 1,
        );
    }

    /// A Mat3 from the top-left 3x3 submatrix of the given Mat4.
    public static fromMat4(m: Mat4): Mat3
    {
        return new Mat3(
            m.a, m.b, m.c,
            m.e, m.f, m.g,
            m.i, m.j, m.k,
        );
    }

    /// A 2D projection matrix with the given bounds.
    public static projection(width: number, height: number): Mat3
    {
        return new Mat3(
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        );
    }

    /// The Normal matrix (invert + transpose) of the given Mat4.
    /// If the transformation does not include any non-uniform scaling, then
    /// the normal matrix is the same as the top-left 3x3 submatrix of the Mat4.
    public static normalMatrixOf(m: Mat4): Mat3 | null
    {
        const a00 = m.a, a01 = m.b, a02 = m.c;
        const a10 = m.e, a11 = m.f, a12 = m.g;
        const a20 = m.i, a21 = m.j, a22 = m.k;
        const b01 = a22 * a11 - a12 * a21;
        const b11 = -a22 * a10 + a12 * a20;
        const b21 = a21 * a10 - a11 * a20;
        let det = a00 * b01 + a01 * b11 + a02 * b21;
        if (!det) {
            return null;
        }
        det = 1 / det;
        return new Mat3(
            b01 * det,
            b11 * det,
            b21 * det,
            (-a22 * a01 + a02 * a21) * det,
            (a22 * a00 - a02 * a20) * det,
            (-a21 * a00 + a01 * a20) * det,
            (a12 * a01 - a02 * a11) * det,
            (-a12 * a00 + a02 * a10) * det,
            (a11 * a00 - a01 * a10) * det,
        );

    }

    // Instance methods --------------------------------------------------------

    /// Defaults to the identity matrix.
    constructor(
        a: number = 1, b: number = 0, c: number = 0,
        d: number = 0, e: number = 1, f: number = 0,
        g: number = 0, h: number = 0, i: number = 1,
    )
    {
        this.a = a; this.b = b; this.c = c;
        this.d = d; this.e = e; this.f = f;
        this.g = g; this.h = h; this.i = i;
    }

    /// Get the value of the given component.
    [index: number]: number;
    get 0(): number { return this.a; }
    get 1(): number { return this.b; }
    get 2(): number { return this.c; }
    get 3(): number { return this.d; }
    get 4(): number { return this.e; }
    get 5(): number { return this.f; }
    get 6(): number { return this.g; }
    get 7(): number { return this.h; }
    get 8(): number { return this.i; }
    get length(): number { return 9; }

    /// Resets this Mat3 to the identity matrix.
    public reset(): Mat3
    {
        this.a = 1; this.b = 0; this.c = 0;
        this.d = 0; this.e = 1; this.f = 0;
        this.g = 0; this.h = 0; this.i = 1;
        return this;
    }

    /// Update this Mat3 from the given array at the given offset.
    public fromArray(array: Array<number>, offset: number = 0): Mat3
    {
        this.a = array[offset + 0];
        this.b = array[offset + 1];
        this.c = array[offset + 2];
        this.d = array[offset + 3];
        this.e = array[offset + 4];
        this.f = array[offset + 5];
        this.g = array[offset + 6];
        this.h = array[offset + 7];
        this.i = array[offset + 8];
        return this;
    }

    /// Write this Mat3 to the given array at the given offset.
    public toArray(array: Array<number> | null = null, offset: number = 0): Array<number>
    {
        if (array === null) {
            array = new Array<number>(9);
        }
        array[offset + 0] = this.a;
        array[offset + 1] = this.b;
        array[offset + 2] = this.c;
        array[offset + 3] = this.d;
        array[offset + 4] = this.e;
        array[offset + 5] = this.f;
        array[offset + 6] = this.g;
        array[offset + 7] = this.h;
        array[offset + 8] = this.i;
        return array;
    }

    /// A new Mat3 with the same elements as this one.
    public clone(): Mat3
    {
        return new Mat3(
            this.a, this.b, this.c,
            this.d, this.e, this.f,
            this.g, this.h, this.i,
        );
    }

    /// Copy the elements of the given Mat3 into this one.
    public copy(m: Mat3): Mat3
    {
        this.a = m.a; this.b = m.b; this.c = m.c;
        this.d = m.d; this.e = m.e; this.f = m.f;
        this.g = m.g; this.h = m.h; this.i = m.i;
        return this;
    }

    /// Tests for equality between this Mat3 and another.
    public equals(other: Mat3, epsilon: number = EPSILON): boolean
    {
        return (
            Math.abs(this.a - other.a) <= epsilon &&
            Math.abs(this.b - other.b) <= epsilon &&
            Math.abs(this.c - other.c) <= epsilon &&
            Math.abs(this.d - other.d) <= epsilon &&
            Math.abs(this.e - other.e) <= epsilon &&
            Math.abs(this.f - other.f) <= epsilon &&
            Math.abs(this.g - other.g) <= epsilon &&
            Math.abs(this.h - other.h) <= epsilon &&
            Math.abs(this.i - other.i) <= epsilon
        );
    }

    /// Transpose this Mat3 in-place.
    public transpose(): Mat3
    {
        let t;
        t = this.b; this.b = this.d; this.d = t;
        t = this.c; this.c = this.g; this.g = t;
        t = this.f; this.f = this.h; this.h = t;
        return this;
    }

    /// Store the transpose of other in this Mat3.
    public transposeOf(other: Mat3): Mat3
    {
        this.a = other.a; this.b = other.d; this.c = other.g;
        this.d = other.b; this.e = other.e; this.f = other.h;
        this.g = other.c; this.h = other.f; this.i = other.i;
        return this;
    }

    /// Invert this Mat3 in-place.
    public invert(): Mat3 | null
    {
        const a00 = this.a, a01 = this.b, a02 = this.c;
        const a10 = this.d, a11 = this.e, a12 = this.f;
        const a20 = this.g, a21 = this.h, a22 = this.i;
        const b01 = a22 * a11 - a12 * a21;
        const b11 = -a22 * a10 + a12 * a20;
        const b21 = a21 * a10 - a11 * a20;
        let det = a00 * b01 + a01 * b11 + a02 * b21;
        if (!det) {
            return null;
        }
        det = 1 / det;
        this.a = b01 * det;
        this.b = (-a22 * a01 + a02 * a21) * det;
        this.c = (a12 * a01 - a02 * a11) * det;
        this.d = b11 * det;
        this.e = (a22 * a00 - a02 * a20) * det;
        this.f = (-a12 * a00 + a02 * a10) * det;
        this.g = b21 * det;
        this.h = (-a21 * a00 + a01 * a20) * det;
        this.i = (a11 * a00 - a01 * a10) * det;
        return this;
    }

    /// Store the inverse of other in this Mat3.
    public inverseOf(other: Mat3): Mat3 | null
    {
        const a00 = other.a, a01 = other.b, a02 = other.c;
        const a10 = other.d, a11 = other.e, a12 = other.f;
        const a20 = other.g, a21 = other.h, a22 = other.i;
        const b01 = a22 * a11 - a12 * a21;
        const b11 = -a22 * a10 + a12 * a20;
        const b21 = a21 * a10 - a11 * a20;
        let det = a00 * b01 + a01 * b11 + a02 * b21;
        if (!det) {
            return null;
        }
        det = 1 / det;
        this.a = b01 * det;
        this.b = (-a22 * a01 + a02 * a21) * det;
        this.c = (a12 * a01 - a02 * a11) * det;
        this.d = b11 * det;
        this.e = (a22 * a00 - a02 * a20) * det;
        this.f = (-a12 * a00 + a02 * a10) * det;
        this.g = b21 * det;
        this.h = (-a21 * a00 + a01 * a20) * det;
        this.i = (a11 * a00 - a01 * a10) * det;
        return this;
    }

    /// Change this Mat3 to its adjoint.
    public adjoint(): Mat3
    {
        const a00 = this.a, a01 = this.b, a02 = this.c;
        const a10 = this.d, a11 = this.e, a12 = this.f;
        const a20 = this.g, a21 = this.h, a22 = this.i;
        this.a = a11 * a22 - a12 * a21;
        this.b = a02 * a21 - a01 * a22;
        this.c = a01 * a12 - a02 * a11;
        this.d = a12 * a20 - a10 * a22;
        this.e = a00 * a22 - a02 * a20;
        this.f = a02 * a10 - a00 * a12;
        this.g = a10 * a21 - a11 * a20;
        this.h = a01 * a20 - a00 * a21;
        this.i = a00 * a11 - a01 * a10;
        return this;
    }

    /// Store the adjoint of other in this Mat3.
    public adjointOf(other: Mat3): Mat3
    {
        const a00 = other.a, a01 = other.b, a02 = other.c;
        const a10 = other.d, a11 = other.e, a12 = other.f;
        const a20 = other.g, a21 = other.h, a22 = other.i;
        this.a = a11 * a22 - a12 * a21;
        this.b = a02 * a21 - a01 * a22;
        this.c = a01 * a12 - a02 * a11;
        this.d = a12 * a20 - a10 * a22;
        this.e = a00 * a22 - a02 * a20;
        this.f = a02 * a10 - a00 * a12;
        this.g = a10 * a21 - a11 * a20;
        this.h = a01 * a20 - a00 * a21;
        this.i = a00 * a11 - a01 * a10;
        return this;
    }

    /// The determinant of this Mat3.
    public determinant(): number
    {
        const a10 = this.d, a11 = this.e, a12 = this.f;
        const a20 = this.g, a21 = this.h, a22 = this.i;
        return this.a * (a22 * a11 - a12 * a21) + this.b * (-a22 * a10 + a12 * a20) + this.c * (a21 * a10 - a11 * a20);
    }

    /// this *= other
    public multiply(other: Mat3): Mat3
    {
        const a00 = this.a, a10 = this.d, a20 = this.g;
        const a01 = this.b, a11 = this.e, a21 = this.h;
        const a02 = this.c, a12 = this.f, a22 = this.i;
        let b0 = other.a, b1 = other.b, b2 = other.c;
        this.a = a00 * b0 + a10 * b1 + a20 * b2;
        this.b = a01 * b0 + a11 * b1 + a21 * b2;
        this.c = a02 * b0 + a12 * b1 + a22 * b2;
        b0 = other.d, b1 = other.e, b2 = other.f;
        this.d = a00 * b0 + a10 * b1 + a20 * b2;
        this.e = a01 * b0 + a11 * b1 + a21 * b2;
        this.f = a02 * b0 + a12 * b1 + a22 * b2;
        b0 = other.g, b1 = other.h, b2 = other.i;
        this.g = a00 * b0 + a10 * b1 + a20 * b2;
        this.h = a01 * b0 + a11 * b1 + a21 * b2;
        this.i = a02 * b0 + a12 * b1 + a22 * b2;
        return this;
    }

    /// this = other * this
    public preMultiply(other: Mat3): Mat3
    {
        const a00 = other.a, a10 = other.d, a20 = other.g;
        const a01 = other.b, a11 = other.e, a21 = other.h;
        const a02 = other.c, a12 = other.f, a22 = other.i;
        let b0 = this.a, b1 = this.b, b2 = this.c;
        this.a = a00 * b0 + a10 * b1 + a20 * b2;
        this.b = a01 * b0 + a11 * b1 + a21 * b2;
        this.c = a02 * b0 + a12 * b1 + a22 * b2;
        b0 = this.d, b1 = this.e, b2 = this.f;
        this.d = a00 * b0 + a10 * b1 + a20 * b2;
        this.e = a01 * b0 + a11 * b1 + a21 * b2;
        this.f = a02 * b0 + a12 * b1 + a22 * b2;
        b0 = this.g, b1 = this.h, b2 = this.i;
        this.g = a00 * b0 + a10 * b1 + a20 * b2;
        this.h = a01 * b0 + a11 * b1 + a21 * b2;
        this.i = a02 * b0 + a12 * b1 + a22 * b2;
        return this;
    }

    /// this = m1 * m2
    public productOf(m1: Mat3, m2: Mat3): Mat3
    {
        const a00 = m1.a, a10 = m1.d, a20 = m1.g;
        const a01 = m1.b, a11 = m1.e, a21 = m1.h;
        const a02 = m1.c, a12 = m1.f, a22 = m1.i;
        let b0 = m2.a, b1 = m2.b, b2 = m2.c;
        this.a = a00 * b0 + a10 * b1 + a20 * b2;
        this.b = a01 * b0 + a11 * b1 + a21 * b2;
        this.c = a02 * b0 + a12 * b1 + a22 * b2;
        b0 = m2.d, b1 = m2.e, b2 = m2.f;
        this.d = a00 * b0 + a10 * b1 + a20 * b2;
        this.e = a01 * b0 + a11 * b1 + a21 * b2;
        this.f = a02 * b0 + a12 * b1 + a22 * b2;
        b0 = m2.g, b1 = m2.h, b2 = m2.i;
        this.g = a00 * b0 + a10 * b1 + a20 * b2;
        this.h = a01 * b0 + a11 * b1 + a21 * b2;
        this.i = a02 * b0 + a12 * b1 + a22 * b2;
        return this;
    }

    /// 2D Translation of this Mat3 by the given Vec2.
    public translate(vec: Vec2): Mat3
    {
        const x = vec.x, y = vec.y;
        this.g += this.a * x + this.d * y;
        this.h += this.b * x + this.e * y;
        this.i += this.c * x + this.f * y;
        return this;
    }

    /// 2D Translation of this Mat3 by the given distance along the x-axis.
    public translateX(delta: number): Mat3
    {
        this.g += this.a * delta;
        this.h += this.b * delta;
        this.i += this.c * delta;
        return this;
    }

    /// 2D Translation of this Mat3 by the given distance along the y-axis.
    public translateY(delta: number): Mat3
    {
        this.g += this.d * delta;
        this.h += this.e * delta;
        this.i += this.f * delta;
        return this;
    }

    /// 2D Rotation of this Mat3 around the origin by the given angle in radians.
    public rotate(angle: number): Mat3
    {
        const a00 = this.a, a01 = this.b, a02 = this.c;
        const a10 = this.d, a11 = this.e, a12 = this.f;
        const s = Math.sin(angle), c = Math.cos(angle);
        this.a = c * a00 + s * a10;
        this.b = c * a01 + s * a11;
        this.c = c * a02 + s * a12;
        this.d = c * a10 - s * a00;
        this.e = c * a11 - s * a01;
        this.f = c * a12 - s * a02;
        return this;
    }


    /// 2D Scaling of this Mat3 by the given Vec2.
    public scale(vec: Vec2): Mat3
    {
        const x = vec.x, y = vec.y;
        this.a *= x;
        this.b *= x;
        this.c *= x;
        this.d *= y;
        this.e *= y;
        this.f *= y;
        return this;
    }

    /// Updates this Mat3 from the top-left 3x3 submatrix of the given Mat4.
    public fromMat4(m: Mat4): Mat3
    {
        this.a = m.a; this.b = m.b; this.c = m.c;
        this.d = m.e; this.e = m.f; this.f = m.g;
        this.g = m.i; this.h = m.j; this.i = m.k;
        return this;
    }

    /// Allows the use of Mat3 in a for-of loop.
    *[Symbol.iterator](): Generator<number, void, unknown>
    {
        yield this.a; yield this.b; yield this.c;
        yield this.d; yield this.e; yield this.f;
        yield this.g; yield this.h; yield this.i;
    }
}

// This is used to identify Mat3 objects in the code.
// It is stored as a property on the prototype so that does not take up
// any space in the actual object, but one can still access it.
(Mat3.prototype as any).isMat3 = true;

/// This is to identify any glance math primitive in the code.
(Mat3.prototype as any).isMathPrimitive = true;
