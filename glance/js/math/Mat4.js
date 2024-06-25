import { EPSILON } from "./common.js";
import { Vec3 } from "./Vec3.js";
import { Mat3 } from "./Mat3.js";
/// A 4x4 matrix.
/// The matrix is stored in column-major order:
///  | a e i m |
///  | b f j n |
///  | c g k o |
///  | d h l p |
export class Mat4 {
    // Amazingly, this is faster than using an Array or a Float32Array.
    a;
    b;
    c;
    d;
    e;
    f;
    g;
    h;
    i;
    j;
    k;
    l;
    m;
    n;
    o;
    p;
    // Static methods ----------------------------------------------------------
    /// A Mat4 with all elements set to n.
    static all(n) {
        return new Mat4(n, n, n, n, n, n, n, n, n, n, n, n, n, n, n, n);
    }
    /// A Mat4 with all elements set to a random value in the range [0, 1).
    static random() {
        return new Mat4(Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random());
    }
    /// A new Matrix with components initialized from the given array at the given offset.
    static fromArray(array, offset = 0) {
        return new Mat4(array[offset + 0], array[offset + 1], array[offset + 2], array[offset + 3], array[offset + 4], array[offset + 5], array[offset + 6], array[offset + 7], array[offset + 8], array[offset + 9], array[offset + 10], array[offset + 11], array[offset + 12], array[offset + 13], array[offset + 14], array[offset + 15]);
    }
    /// The identity matrix.
    static identity() {
        return new Mat4();
    }
    /// A 3D translation matrix with the given Vec3.
    static fromTranslation(v, y, z) {
        if (typeof v === 'number') {
            return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v, y ?? v, z ?? v, 1);
        }
        else {
            return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v.x, v.y, v.z, 1);
        }
    }
    /// Construct a Mat4 from four Vec3s.
    static fromVec3s(a, b, c, d) {
        return new Mat4(a.x, a.y, a.z, 0, b.x, b.y, b.z, 0, c.x, c.y, c.z, 0, d.x, d.y, d.z, 1);
    }
    /// Construct a Mat4 from four Vec4s.
    static fromVec4s(a, b, c, d) {
        return new Mat4(a.x, a.y, a.z, a.w, b.x, b.y, b.z, b.w, c.x, c.y, c.z, c.w, d.x, d.y, d.z, d.w);
    }
    /// A 3D translation matrix with the given distance along the x-axis.
    static fromTranslationX(delta) {
        return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, delta, 0, 0, 1);
    }
    /// A 3D translation matrix with the given distance along the y-axis.
    static fromTranslationY(delta) {
        return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, delta, 0, 1);
    }
    /// A 3D translation matrix with the given distance along the z-axis.
    static fromTranslationZ(delta) {
        return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, delta, 1);
    }
    /// A 3D rotation matrix around the given unit axis by the given angle in radians.
    static fromRotation(axis, angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const t = 1 - c;
        let x = axis.x, y = axis.y, z = axis.z;
        const tx = t * x, ty = t * y, tz = t * z;
        const sx = s * x, sy = s * y, sz = s * z;
        return new Mat4(tx * x + c, tx * y + sz, tx * z - sy, 0, ty * x - sz, ty * y + c, ty * z + sx, 0, tz * x + sy, tz * y - sx, tz * z + c, 0, 0, 0, 0, 1);
    }
    /// A 3D rotation matrix around the X axis by the given angle in radians.
    static fromRotationX(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return new Mat4(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    }
    /// A 3D rotation matrix around the Y axis by the given angle in radians.
    static fromRotationY(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return new Mat4(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    }
    /// A 3D rotation matrix around the Z axis by the given angle in radians.
    static fromRotationZ(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return new Mat4(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    /// A 3D rotation matrix from the given Quat.
    static fromQuat(q) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        return new Mat4(1 - (yy + zz), xy + wz, xz - wy, 0, xy - wz, 1 - (xx + zz), yz + wx, 0, xz + wy, yz - wx, 1 - (xx + yy), 0, 0, 0, 0, 1);
    }
    /// A 3D scaling matrix with the given Vec3 on the diagonal.
    static fromScale(v) {
        let x, y, z;
        if (typeof v === 'number') {
            x = v, y = v, z = v;
        }
        else {
            x = v.x, y = v.y, z = v.z;
        }
        return new Mat4(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    /// A Mat4 with the first three columns set to the given Vec3s.
    static fromBasis(x, y, z) {
        return new Mat4(x.x, x.y, x.z, 0, y.x, y.y, y.z, 0, z.x, z.y, z.z, 0, 0, 0, 0, 1);
    }
    /// A Mat4 with the given position, rotation, and scale.
    static compose(pos, rot, scale) {
        const x = rot.x, y = rot.y, z = rot.z, w = rot.w;
        const sx = scale.x, sy = scale.y, sz = scale.z;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        return new Mat4((1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0, (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0, (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0, pos.x, pos.y, pos.z, 1);
    }
    /// A Mat4 with the top-left 3x3 submatrix set to the given matrix.
    static fromMat3(m) {
        return new Mat4(m.a, m.b, m.c, 0, m.d, m.e, m.f, 0, m.g, m.h, m.i, 0, 0, 0, 0, 1);
    }
    /// An orthographic projection matrix.
    static ortho(left, right, bottom, top, near, far) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        return new Mat4(-2 * lr, 0, 0, 0, 0, -2 * bt, 0, 0, 0, 0, 2 * nf, 0, (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1);
    }
    /// A perspective projection matrix.
    static perspective(fov, aspect, near, far) {
        const f = 1 / Math.tan(fov / 2);
        const nf = 1 / (near - far);
        return new Mat4(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0);
    }
    /// A look-at matrix.
    static lookAt(eye, center, up) {
        const ex = eye.x, ey = eye.y, ez = eye.z;
        let dx = ex - center.x, dy = ey - center.y, dz = ez - center.z;
        if (Math.abs(dx) == 0 && Math.abs(dy) == 0 && Math.abs(dz) == 0) {
            return new Mat4();
        }
        let len = 1 / Math.hypot(dx, dy, dz);
        dx *= len, dy *= len, dz *= len;
        const upx = up.x, upy = up.y, upz = up.z;
        let x0 = upy * dz - upz * dy;
        let x1 = upz * dx - upx * dz;
        let x2 = upx * dy - upy * dx;
        len = Math.hypot(x0, x1, x2);
        if (len == 0) {
            x0 = 0, x1 = 0, x2 = 0;
        }
        else {
            len = 1 / len;
            x0 *= len, x1 *= len, x2 *= len;
        }
        let y0 = dy * x2 - dz * x1;
        let y1 = dz * x0 - dx * x2;
        let y2 = dx * x1 - dy * x0;
        len = Math.hypot(y0, y1, y2);
        if (len == 0) {
            y0 = 0, y1 = 0, y2 = 0;
        }
        else {
            len = 1 / len;
            y0 *= len, y1 *= len, y2 *= len;
        }
        return new Mat4(x0, y0, dx, 0, x1, y1, dy, 0, x2, y2, dz, 0, -(x0 * ex + x1 * ey + x2 * ez), -(y0 * ex + y1 * ey + y2 * ez), -(dx * ex + dy * ey + dz * ez), 1);
    }
    /// A Mat4 that is the inverse of another.
    static inverseOf(m) {
        const a00 = m.a, a01 = m.b, a02 = m.c, a03 = m.d;
        const a10 = m.e, a11 = m.f, a12 = m.g, a13 = m.h;
        const a20 = m.i, a21 = m.j, a22 = m.k, a23 = m.l;
        const a30 = m.m, a31 = m.n, a32 = m.o, a33 = m.p;
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return null;
        }
        det = 1 / det;
        return new Mat4((a11 * b11 - a12 * b10 + a13 * b09) * det, (a02 * b10 - a01 * b11 - a03 * b09) * det, (a31 * b05 - a32 * b04 + a33 * b03) * det, (a22 * b04 - a21 * b05 - a23 * b03) * det, (a12 * b08 - a10 * b11 - a13 * b07) * det, (a00 * b11 - a02 * b08 + a03 * b07) * det, (a32 * b02 - a30 * b05 - a33 * b01) * det, (a20 * b05 - a22 * b02 + a23 * b01) * det, (a10 * b10 - a11 * b08 + a13 * b06) * det, (a01 * b08 - a00 * b10 - a03 * b06) * det, (a30 * b04 - a31 * b02 + a33 * b00) * det, (a21 * b02 - a20 * b04 - a23 * b00) * det, (a11 * b07 - a10 * b09 - a12 * b06) * det, (a00 * b09 - a01 * b07 + a02 * b06) * det, (a31 * b01 - a30 * b03 - a32 * b00) * det, (a20 * b03 - a21 * b01 + a22 * b00) * det);
    }
    // Instance methods --------------------------------------------------------
    /// Defaults to the identity matrix.
    constructor(a = 1, b = 0, c = 0, d = 0, e = 0, f = 1, g = 0, h = 0, i = 0, j = 0, k = 1, l = 0, m = 0, n = 0, o = 0, p = 1) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.g = g;
        this.h = h;
        this.i = i;
        this.j = j;
        this.k = k;
        this.l = l;
        this.m = m;
        this.n = n;
        this.o = o;
        this.p = p;
    }
    get 0() { return this.a; }
    get 1() { return this.b; }
    get 2() { return this.c; }
    get 3() { return this.d; }
    get 4() { return this.e; }
    get 5() { return this.f; }
    get 6() { return this.g; }
    get 7() { return this.h; }
    get 8() { return this.i; }
    get 9() { return this.j; }
    get 10() { return this.k; }
    get 11() { return this.l; }
    get 12() { return this.m; }
    get 13() { return this.n; }
    get 14() { return this.o; }
    get 15() { return this.p; }
    get length() { return 16; }
    /// Resets this Mat4 to the identity matrix.
    reset() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 0;
        this.e = 0;
        this.f = 1;
        this.g = 0;
        this.h = 0;
        this.i = 0;
        this.j = 0;
        this.k = 1;
        this.l = 0;
        this.m = 0;
        this.n = 0;
        this.o = 0;
        this.p = 1;
        return this;
    }
    /// Set the value of the Matrix component-wise.
    set(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.g = g;
        this.h = h;
        this.i = i;
        this.j = j;
        this.k = k;
        this.l = l;
        this.m = m;
        this.n = n;
        this.o = o;
        this.p = p;
        return this;
    }
    /// Update this Mat4 from the given array at the given offset.
    fromArray(array, offset = 0) {
        this.a = array[offset + 0];
        this.b = array[offset + 1];
        this.c = array[offset + 2];
        this.d = array[offset + 3];
        this.e = array[offset + 4];
        this.f = array[offset + 5];
        this.g = array[offset + 6];
        this.h = array[offset + 7];
        this.i = array[offset + 8];
        this.j = array[offset + 9];
        this.k = array[offset + 10];
        this.l = array[offset + 11];
        this.m = array[offset + 12];
        this.n = array[offset + 13];
        this.o = array[offset + 14];
        this.p = array[offset + 15];
        return this;
    }
    /// Write this Mat4 to the given array at the given offset.
    toArray(array = null, offset = 0) {
        if (array === null) {
            array = new Array(16);
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
        array[offset + 9] = this.j;
        array[offset + 10] = this.k;
        array[offset + 11] = this.l;
        array[offset + 12] = this.m;
        array[offset + 13] = this.n;
        array[offset + 14] = this.o;
        array[offset + 15] = this.p;
        return array;
    }
    /// A new Mat4 with the same elements as this one.
    clone() {
        return new Mat4(this.a, this.b, this.c, this.d, this.e, this.f, this.g, this.h, this.i, this.j, this.k, this.l, this.m, this.n, this.o, this.p);
    }
    /// Copy the elements of the given Mat4 into this one.
    copy(m) {
        this.a = m.a;
        this.b = m.b;
        this.c = m.c;
        this.d = m.d;
        this.e = m.e;
        this.f = m.f;
        this.g = m.g;
        this.h = m.h;
        this.i = m.i;
        this.j = m.j;
        this.k = m.k;
        this.l = m.l;
        this.m = m.m;
        this.n = m.n;
        this.o = m.o;
        this.p = m.p;
        return this;
    }
    /// Set this Mat4 to the the given position, rotation, and scale.
    compose(pos, rot, scale) {
        const x = rot.x, y = rot.y, z = rot.z, w = rot.w;
        const sx = scale.x, sy = scale.y, sz = scale.z;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        this.a = (1 - (yy + zz)) * sx;
        this.b = (xy + wz) * sx;
        this.c = (xz - wy) * sx;
        this.d = 0;
        this.e = (xy - wz) * sy;
        this.f = (1 - (xx + zz)) * sy;
        this.g = (yz + wx) * sy;
        this.h = 0;
        this.i = (xz + wy) * sz;
        this.j = (yz - wx) * sz;
        this.k = (1 - (xx + yy)) * sz;
        this.l = 0;
        this.m = pos.x;
        this.n = pos.y;
        this.o = pos.z;
        this.p = 1;
        return this;
    }
    /// Decomposes this Mat4 into the given position, rotation, and scale output args.
    decompose(pos, rot, scale) {
        let a00 = this.a, a01 = this.b, a02 = this.c, a03 = this.d;
        let a10 = this.e, a11 = this.f, a12 = this.g, a13 = this.h;
        let a20 = this.i, a21 = this.j, a22 = this.k, a23 = this.l;
        const a30 = this.m, a31 = this.n, a32 = this.o, a33 = this.p;
        const det = (a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32)
            - (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31)
            + (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31)
            + (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30)
            - (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30)
            + (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30);
        const sx = Math.hypot(a00, a01, a02) * Math.sign(det);
        const sy = Math.hypot(a10, a11, a12);
        const sz = Math.hypot(a20, a21, a22);
        pos.x = a30;
        pos.y = a31;
        pos.z = a32;
        a00 /= sx;
        a01 /= sx;
        a02 /= sx;
        a10 /= sy;
        a11 /= sy;
        a12 /= sy;
        a20 /= sz;
        a21 /= sz;
        a22 /= sz;
        const trace = a00 + a11 + a22;
        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);
            rot.x = (a12 - a21) * s;
            rot.y = (a20 - a02) * s;
            rot.z = (a01 - a10) * s;
            rot.w = 0.25 / s;
        }
        else if (a00 > a11 && a00 > a22) {
            const s = 2.0 * Math.sqrt(1.0 + a00 - a11 - a22);
            rot.x = 0.25 * s;
            rot.y = (a10 + a01) / s;
            rot.z = (a20 + a02) / s;
            rot.w = (a12 - a21) / s;
        }
        else if (a11 > a22) {
            const s = 2.0 * Math.sqrt(1.0 + a11 - a00 - a22);
            rot.x = (a10 + a01) / s;
            rot.y = 0.25 * s;
            rot.z = (a21 + a12) / s;
            rot.w = (a20 - a02) / s;
        }
        else {
            const s = 2.0 * Math.sqrt(1.0 + a22 - a00 - a11);
            rot.x = (a20 + a02) / s;
            rot.y = (a21 + a12) / s;
            rot.z = 0.25 * s;
            rot.w = (a01 - a10) / s;
        }
        scale.x = sx;
        scale.y = sy;
        scale.z = sz;
        return this;
    }
    /// Tests for equality between this Mat4 and another.
    equals(other, epsilon = EPSILON) {
        return (Math.abs(this.a - other.a) <= epsilon &&
            Math.abs(this.b - other.b) <= epsilon &&
            Math.abs(this.c - other.c) <= epsilon &&
            Math.abs(this.d - other.d) <= epsilon &&
            Math.abs(this.e - other.e) <= epsilon &&
            Math.abs(this.f - other.f) <= epsilon &&
            Math.abs(this.g - other.g) <= epsilon &&
            Math.abs(this.h - other.h) <= epsilon &&
            Math.abs(this.i - other.i) <= epsilon &&
            Math.abs(this.j - other.j) <= epsilon &&
            Math.abs(this.k - other.k) <= epsilon &&
            Math.abs(this.l - other.l) <= epsilon &&
            Math.abs(this.m - other.m) <= epsilon &&
            Math.abs(this.n - other.n) <= epsilon &&
            Math.abs(this.o - other.o) <= epsilon &&
            Math.abs(this.p - other.p) <= epsilon);
    }
    /// Transpose this Mat4 in-place.
    transpose() {
        let t;
        t = this.b;
        this.b = this.e;
        this.e = t;
        t = this.c;
        this.c = this.i;
        this.i = t;
        t = this.g;
        this.g = this.j;
        this.j = t;
        t = this.d;
        this.d = this.m;
        this.m = t;
        t = this.h;
        this.h = this.n;
        this.n = t;
        t = this.l;
        this.l = this.o;
        this.o = t;
        return this;
    }
    /// Store the transpose of other in this Mat4.
    transposeOf(other) {
        this.a = other.a;
        this.b = other.e;
        this.c = other.i;
        this.d = other.m;
        this.e = other.b;
        this.f = other.f;
        this.g = other.j;
        this.h = other.n;
        this.i = other.c;
        this.j = other.g;
        this.k = other.k;
        this.l = other.o;
        this.m = other.d;
        this.n = other.h;
        this.o = other.l;
        this.p = other.p;
        return this;
    }
    /// Invert this Mat4 in-place.
    invert() {
        const a00 = this.a, a01 = this.b, a02 = this.c, a03 = this.d;
        const a10 = this.e, a11 = this.f, a12 = this.g, a13 = this.h;
        const a20 = this.i, a21 = this.j, a22 = this.k, a23 = this.l;
        const a30 = this.m, a31 = this.n, a32 = this.o, a33 = this.p;
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return null;
        }
        det = 1 / det;
        this.a = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.b = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.c = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.d = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.e = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.f = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.g = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.h = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.i = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.j = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.k = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.l = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.m = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.n = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.o = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.p = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return this;
    }
    /// Store the inverse of other in this Mat4.
    inverseOf(other) {
        const a00 = other.a, a01 = other.b, a02 = other.c, a03 = other.d;
        const a10 = other.e, a11 = other.f, a12 = other.g, a13 = other.h;
        const a20 = other.i, a21 = other.j, a22 = other.k, a23 = other.l;
        const a30 = other.m, a31 = other.n, a32 = other.o, a33 = other.p;
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return null;
        }
        det = 1 / det;
        this.a = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.b = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.c = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.d = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.e = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.f = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.g = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.h = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.i = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.j = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.k = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.l = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.m = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.n = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.o = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.p = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return this;
    }
    /// Change this Mat4 to its adjoint.
    adjoint() {
        const a00 = this.a, a01 = this.b, a02 = this.c, a03 = this.d;
        const a10 = this.e, a11 = this.f, a12 = this.g, a13 = this.h;
        const a20 = this.i, a21 = this.j, a22 = this.k, a23 = this.l;
        const a30 = this.m, a31 = this.n, a32 = this.o, a33 = this.p;
        this.a = +(a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
        this.b = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        this.c = +(a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
        this.d = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        this.e = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        this.f = +(a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
        this.g = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        this.h = +(a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
        this.i = +(a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
        this.j = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        this.k = +(a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
        this.l = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        this.m = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        this.n = +(a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
        this.o = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        this.p = +(a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
        return this;
    }
    /// Store the adjoint of other in this Mat4.
    adjointOf(other) {
        const a00 = other.a, a01 = other.b, a02 = other.c, a03 = other.d;
        const a10 = other.e, a11 = other.f, a12 = other.g, a13 = other.h;
        const a20 = other.i, a21 = other.j, a22 = other.k, a23 = other.l;
        const a30 = other.m, a31 = other.n, a32 = other.o, a33 = other.p;
        this.a = +(a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
        this.b = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        this.c = +(a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
        this.d = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        this.e = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        this.f = +(a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
        this.g = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        this.h = +(a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
        this.i = +(a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
        this.j = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        this.k = +(a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
        this.l = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        this.m = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        this.n = +(a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
        this.o = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        this.p = +(a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
        return this;
    }
    /// The determinant of this Mat4.
    determinant() {
        const a00 = this.a, a01 = this.b, a02 = this.c, a03 = this.d;
        const a10 = this.e, a11 = this.f, a12 = this.g, a13 = this.h;
        const a20 = this.i, a21 = this.j, a22 = this.k, a23 = this.l;
        const a30 = this.m, a31 = this.n, a32 = this.o, a33 = this.p;
        return (a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32)
            - (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31)
            + (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31)
            + (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30)
            - (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30)
            + (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30);
    }
    /// this *= other
    multiply(other) {
        const a00 = this.a, a01 = this.b, a02 = this.c, a03 = this.d;
        const a10 = this.e, a11 = this.f, a12 = this.g, a13 = this.h;
        const a20 = this.i, a21 = this.j, a22 = this.k, a23 = this.l;
        const a30 = this.m, a31 = this.n, a32 = this.o, a33 = this.p;
        let b0 = other.a, b1 = other.b, b2 = other.c, b3 = other.d;
        this.a = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.b = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.c = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.d = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other.e, b1 = other.f, b2 = other.g, b3 = other.h;
        this.e = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.f = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.g = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.h = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other.i, b1 = other.j, b2 = other.k, b3 = other.l;
        this.i = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.j = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.k = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.l = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other.m, b1 = other.n, b2 = other.o, b3 = other.p;
        this.m = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.n = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.o = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.p = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return this;
    }
    /// this = other * this
    preMultiply(other) {
        const a00 = other.a, a01 = other.b, a02 = other.c, a03 = other.d;
        const a10 = other.e, a11 = other.f, a12 = other.g, a13 = other.h;
        const a20 = other.i, a21 = other.j, a22 = other.k, a23 = other.l;
        const a30 = other.m, a31 = other.n, a32 = other.o, a33 = other.p;
        let b0 = this.a, b1 = this.b, b2 = this.c, b3 = this.d;
        this.a = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.b = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.c = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.d = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = this.e, b1 = this.f, b2 = this.g, b3 = this.h;
        this.e = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.f = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.g = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.h = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = this.i, b1 = this.j, b2 = this.k, b3 = this.l;
        this.i = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.j = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.k = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.l = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = this.m, b1 = this.n, b2 = this.o, b3 = this.p;
        this.m = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.n = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.o = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.p = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return this;
    }
    /// this = m1 * m2
    productOf(m1, m2) {
        const a00 = m1.a, a01 = m1.b, a02 = m1.c, a03 = m1.d;
        const a10 = m1.e, a11 = m1.f, a12 = m1.g, a13 = m1.h;
        const a20 = m1.i, a21 = m1.j, a22 = m1.k, a23 = m1.l;
        const a30 = m1.m, a31 = m1.n, a32 = m1.o, a33 = m1.p;
        let b0 = m2.a, b1 = m2.b, b2 = m2.c, b3 = m2.d;
        this.a = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.b = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.c = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.d = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = m2.e, b1 = m2.f, b2 = m2.g, b3 = m2.h;
        this.e = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.f = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.g = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.h = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = m2.i, b1 = m2.j, b2 = m2.k, b3 = m2.l;
        this.i = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.j = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.k = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.l = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = m2.m, b1 = m2.n, b2 = m2.o, b3 = m2.p;
        this.m = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.n = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.o = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.p = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return this;
    }
    /// 3D Translation of this Mat4 by the given Vec3.
    translate(vec) {
        const x = vec.x, y = vec.y, z = vec.z;
        this.m += this.a * x + this.e * y + this.i * z;
        this.n += this.b * x + this.f * y + this.j * z;
        this.o += this.c * x + this.g * y + this.k * z;
        this.p += this.d * x + this.h * y + this.l * z;
        return this;
    }
    /// 3D Translation of this Mat4 by the given distances along the x, y, and z axes.
    translate3(x, y, z) {
        this.m += this.a * x + this.e * y + this.i * z;
        this.n += this.b * x + this.f * y + this.j * z;
        this.o += this.c * x + this.g * y + this.k * z;
        this.p += this.d * x + this.h * y + this.l * z;
        return this;
    }
    /// 3D Translation of this Mat4 by the given distance along the x-axis.
    translateX(delta) {
        this.m += this.a * delta;
        this.n += this.b * delta;
        this.o += this.c * delta;
        this.p += this.d * delta;
        return this;
    }
    /// 3D Translation of this Mat4 by the given distance along the y-axis.
    translateY(delta) {
        this.m += this.e * delta;
        this.n += this.f * delta;
        this.o += this.g * delta;
        this.p += this.h * delta;
        return this;
    }
    /// 3D Translation of this Mat4 by the given distance along the z-axis.
    translateZ(delta) {
        this.m += this.i * delta;
        this.n += this.j * delta;
        this.o += this.k * delta;
        this.p += this.l * delta;
        return this;
    }
    /// 3D Rotation of this Mat4 around the given unit axis by the given angle in radians.
    rotate(axis, angle) {
        let x = axis.x, y = axis.y, z = axis.z;
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const t = 1 - c;
        const b00 = x * x * t + c;
        const b01 = y * x * t + z * s;
        const b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s;
        const b11 = y * y * t + c;
        const b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s;
        const b21 = y * z * t - x * s;
        const b22 = z * z * t + c;
        const a00 = this.a, a01 = this.b, a02 = this.c, a03 = this.d;
        const a10 = this.e, a11 = this.f, a12 = this.g, a13 = this.h;
        const a20 = this.i, a21 = this.j, a22 = this.k, a23 = this.l;
        this.a = a00 * b00 + a10 * b01 + a20 * b02;
        this.b = a01 * b00 + a11 * b01 + a21 * b02;
        this.c = a02 * b00 + a12 * b01 + a22 * b02;
        this.d = a03 * b00 + a13 * b01 + a23 * b02;
        this.e = a00 * b10 + a10 * b11 + a20 * b12;
        this.f = a01 * b10 + a11 * b11 + a21 * b12;
        this.g = a02 * b10 + a12 * b11 + a22 * b12;
        this.h = a03 * b10 + a13 * b11 + a23 * b12;
        this.i = a00 * b20 + a10 * b21 + a20 * b22;
        this.j = a01 * b20 + a11 * b21 + a21 * b22;
        this.k = a02 * b20 + a12 * b21 + a22 * b22;
        this.l = a03 * b20 + a13 * b21 + a23 * b22;
        return this;
    }
    /// 3D Rotation of this Mat4 around the x-axis by the given angle in radians.
    rotateX(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const a10 = this.e, a11 = this.f, a12 = this.g, a13 = this.h;
        const a20 = this.i, a21 = this.j, a22 = this.k, a23 = this.l;
        this.e = a10 * c + a20 * s;
        this.f = a11 * c + a21 * s;
        this.g = a12 * c + a22 * s;
        this.h = a13 * c + a23 * s;
        this.i = a20 * c - a10 * s;
        this.j = a21 * c - a11 * s;
        this.k = a22 * c - a12 * s;
        this.l = a23 * c - a13 * s;
        return this;
    }
    /// 3D Rotation of this Mat4 around the y-axis by the given angle in radians.
    rotateY(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const a00 = this.a, a01 = this.b, a02 = this.c, a03 = this.d;
        const a20 = this.i, a21 = this.j, a22 = this.k, a23 = this.l;
        this.a = a00 * c - a20 * s;
        this.b = a01 * c - a21 * s;
        this.c = a02 * c - a22 * s;
        this.d = a03 * c - a23 * s;
        this.i = a20 * c + a00 * s;
        this.j = a21 * c + a01 * s;
        this.k = a22 * c + a02 * s;
        this.l = a23 * c + a03 * s;
        return this;
    }
    /// 3D Rotation of this Mat4 around the z-axis by the given angle in radians.
    rotateZ(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const a00 = this.a, a01 = this.b, a02 = this.c, a03 = this.d;
        const a10 = this.e, a11 = this.f, a12 = this.g, a13 = this.h;
        this.a = a00 * c + a10 * s;
        this.b = a01 * c + a11 * s;
        this.c = a02 * c + a12 * s;
        this.d = a03 * c + a13 * s;
        this.e = a10 * c - a00 * s;
        this.f = a11 * c - a01 * s;
        this.g = a12 * c - a02 * s;
        this.h = a13 * c - a03 * s;
        return this;
    }
    /// 3D Scaling of this Mat4 by the given Vec3.
    scale(v) {
        let x, y, z;
        if (typeof v === 'number') {
            x = v, y = v, z = v;
        }
        else {
            x = v.x, y = v.y, z = v.z;
        }
        this.a *= x, this.b *= x, this.c *= x, this.d *= x;
        this.e *= y, this.f *= y, this.g *= y, this.h *= y;
        this.i *= z, this.j *= z, this.k *= z, this.l *= z;
        return this;
    }
    /// A perspective projection matrix.
    perspective(fov, aspect, near, far) {
        const f = 1 / Math.tan(fov / 2);
        const nf = 1 / (near - far);
        return this.set(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0);
    }
    /// An orthographic projection matrix.
    ortho(left, right, bottom, top, near, far) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        return this.set(-2 * lr, 0, 0, 0, 0, -2 * bt, 0, 0, 0, 0, 2 * nf, 0, (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1);
    }
    lookAt(eye, target, up) {
        const ex = eye.x, ey = eye.y, ez = eye.z;
        let dx = ex - target.x, dy = ey - target.y, dz = ez - target.z;
        if (Math.abs(dx) == 0 && Math.abs(dy) == 0 && Math.abs(dz) == 0) {
            return this.reset();
        }
        let len = 1 / Math.hypot(dx, dy, dz);
        dx *= len, dy *= len, dz *= len;
        const upx = up.x, upy = up.y, upz = up.z;
        let x0 = upy * dz - upz * dy;
        let x1 = upz * dx - upx * dz;
        let x2 = upx * dy - upy * dx;
        len = Math.hypot(x0, x1, x2);
        if (len == 0) {
            x0 = 0, x1 = 0, x2 = 0;
        }
        else {
            len = 1 / len;
            x0 *= len, x1 *= len, x2 *= len;
        }
        let y0 = dy * x2 - dz * x1;
        let y1 = dz * x0 - dx * x2;
        let y2 = dx * x1 - dy * x0;
        len = Math.hypot(y0, y1, y2);
        if (len == 0) {
            y0 = 0, y1 = 0, y2 = 0;
        }
        else {
            len = 1 / len;
            y0 *= len, y1 *= len, y2 *= len;
        }
        return this.set(x0, y0, dx, 0, x1, y1, dy, 0, x2, y2, dz, 0, -(x0 * ex + x1 * ey + x2 * ez), -(y0 * ex + y1 * ey + y2 * ez), -(dx * ex + dy * ey + dz * ez), 1);
    }
    /// Updates this Mat4 to be a rotation matrix representing the given quaternion.
    fromQuat(q) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        this.a = 1 - (yy + zz);
        this.b = xy + wz;
        this.c = xz - wy;
        this.d = 0;
        this.e = xy - wz;
        this.f = 1 - (xx + zz);
        this.g = yz + wx;
        this.h = 0;
        this.i = xz + wy;
        this.j = yz - wx;
        this.k = 1 - (xx + yy);
        this.l = 0;
        this.m = 0;
        this.n = 0;
        this.o = 0;
        this.p = 1;
        return this;
    }
    /// The translation component of this Mat4.
    getTranslation() {
        return new Vec3(this.m, this.n, this.o);
    }
    /// The rotation component of this Mat4.
    getMat3() {
        return new Mat3(this.a, this.b, this.c, this.e, this.f, this.g, this.i, this.j, this.k);
    }
    /// The scaling factors of this Mat4.
    getScaling() {
        return new Vec3(Math.hypot(this.a, this.b, this.c), Math.hypot(this.e, this.f, this.g), Math.hypot(this.i, this.j, this.k));
    }
    /// Allows the use of Mat4 in a for-of loop.
    *[Symbol.iterator]() {
        yield this.a;
        yield this.b;
        yield this.c;
        yield this.d;
        yield this.e;
        yield this.f;
        yield this.g;
        yield this.h;
        yield this.i;
        yield this.j;
        yield this.k;
        yield this.l;
        yield this.m;
        yield this.n;
        yield this.o;
        yield this.p;
    }
}
// This is used to identify Mat4 objects in the code.
// It is stored as a property on the prototype so that does not take up
// any space in the actual object, but one can still access it.
Mat4.prototype.isMat4 = true;
/// This is to identify any glance math primitive in the code.
Mat4.prototype.isMathPrimitive = true;
