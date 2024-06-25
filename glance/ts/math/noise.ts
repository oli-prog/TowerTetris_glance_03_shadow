import { Vec3 } from "./Vec3.js";
import { Vec4 } from "./Vec4.js";
import { Mat3 } from "./Mat3.js";
import { Mat4 } from "./Mat4.js";

export
{
    mulberry32,
    openSimplex2SHeightmap,
};


// =============================================================================
// Random Number Generators
// =============================================================================

/// Returns a random number generator using the given seed.
/// The generator is based on the 32-bit version of the Mulberry32 algorithm.
/// This can be used to generate random numbers in a deterministic way, unlike
/// the built -in Math.random().
/// @param seed Seed for the random number generator
function mulberry32(seed: number): () => number
{
    return function ()
    {
        var t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}


/// ============================================================================
/// Open Simplex Noise
/// Adapted from the glsl code at https://github.com/KdotJPG/OpenSimplex2/blob/master/glsl/OpenSimplex2S.glsl
/// Licensed under CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
///
/// `openSimplex2SHeightmap` is called `openSimplex2SDerivatives_ImproveXY` in the original.
/// ============================================================================

// Borrowed from Stefan Gustavson's noise code
function permute(t: Vec4)
{
    t.x *= t.x * 34 + 133;
    t.y *= t.y * 34 + 133;
    t.z *= t.z * 34 + 133;
    t.w *= t.w * 34 + 133;
    return t;
}

// Gradient set is a normalized expanded rhombic dodecahedron
function grad(hash: number)
{
    // Random vertex of a cube, +/- 1 each
    const cube: Vec3 = new Vec3(hash, hash / 2, hash / 4).floor().modAll(2).scale(2).subtractAll(1);

    // Random edge of the three edges connected to that vertex
    // Also a cuboctahedral vertex
    // And corresponds to the face of its dual, the rhombic dodecahedron
    const cuboct: Vec3 = cube.clone();
    cuboct.setIndex(Math.max(0, Math.floor(hash / 16.0)), 0.0);

    // In a funky way, pick one of the four points on the rhombic face
    const type: number = Math.floor(hash / 8.0) % 2.0;
    const rhomb: Vec3 = cube
        .clone()
        .scale(1 - type)
        .add(cube.cross(cuboct).add(cuboct).scale(type));

    // Expand it so that the new edges are the same length
    // as the existing ones
    const grad: Vec3 = cuboct.scale(1.22474487139).add(rhomb);

    // To make all gradients the same length, we only need to shorten the
    // second type of vector. We also put in the whole noise scale constant.
    // The compiler should reduce it into the existing floats. I think.
    grad.scale((1.0 - 0.042942436724648037 * type) * 3.5946317686139184);

    return grad;
}

// BCC lattice split up into 2 cube lattices
function openSimplex2SDerivativesPart(X: Vec3)
{
    const b: Vec3 = X.clone().floor();
    const i4: Vec4 = new Vec4(X.x - b.x, X.y - b.y, X.z - b.z, 2.5);

    // Pick between each pair of oppposite corners in the cube.
    const v1: Vec3 = b.clone().addAll(Math.floor(i4.dot(Vec4.all(0.25))));
    const v2: Vec3 = b
        .clone()
        .add(Vec3.xAxis())
        .add(new Vec3(-1, 1, 1).scale(Math.floor(i4.dot(new Vec4(-0.25, 0.25, 0.25, 0.35)))));
    const v3: Vec3 = b
        .clone()
        .add(Vec3.yAxis())
        .add(new Vec3(1, -1, 1).scale(Math.floor(i4.dot(new Vec4(0.25, -0.25, 0.25, 0.35)))));
    const v4: Vec3 = b
        .add(Vec3.zAxis())
        .add(new Vec3(1, 1, -1).scale(Math.floor(i4.dot(new Vec4(0.25, 0.25, -0.25, 0.35)))));

    // Gradient hashes for the four vertices in this half-lattice.
    let hashes: Vec4 = permute(new Vec4(v1.x, v2.x, v3.x, v4.x).modAll(289.0));
    permute(hashes.add(new Vec4(v1.y, v2.y, v3.y, v4.y)).modAll(289.0));
    permute(hashes.add(new Vec4(v1.z, v2.z, v3.z, v4.z)).modAll(289.0)).modAll(48.0);

    // Gradient extrapolations & kernel function
    const d1: Vec3 = X.clone().subtract(v1);
    const d2: Vec3 = X.clone().subtract(v2);
    const d3: Vec3 = X.clone().subtract(v3);
    const d4: Vec3 = X.subtract(v4);
    const a: Vec4 = Vec4.all(0.75)
        .subtract(new Vec4(d1.dot(d1), d2.dot(d2), d3.dot(d3), d4.dot(d4)))
        .max(0.0);
    const aa: Vec4 = a.clone().multiply(a);
    const aaaa: Vec4 = aa.clone().multiply(aa);
    const g1: Vec3 = grad(hashes.x);
    const g2: Vec3 = grad(hashes.y);
    const g3: Vec3 = grad(hashes.z);
    const g4: Vec3 = grad(hashes.w);
    const extrapolations: Vec4 = new Vec4(d1.dot(g1), d2.dot(g2), d3.dot(g3), d4.dot(g4));

    const height = aaaa.dot(extrapolations);

    // Derivatives of the noise
    const derivative: Vec4 = aa
        .multiply(a)
        .multiply(extrapolations)
        .applyMat4(Mat4.fromVec3s(d1, d2, d3, d4))
        .scale(-8.0)
        .add(aaaa.applyMat4(Mat4.fromVec3s(g1, g2, g3, g4)));

    // Return it all as a vec4
    return new Vec4(derivative.x, derivative.y, derivative.z, height);
}

// Not a skew transform.
const __openSimplex2OrthonormalMap = new Mat3(
    0.788675134594813,
    -0.211324865405187,
    -0.577350269189626,
    -0.211324865405187,
    0.788675134594813,
    -0.577350269189626,
    0.577350269189626,
    0.577350269189626,
    0.577350269189626,
);

/// Returns a heightmap value and its derivatives at a given position.
/// The height is in the w component, and the derivatives are in the xyz components.
function openSimplex2SHeightmap(position: Vec3): Vec4
{
    position.applyMat3(__openSimplex2OrthonormalMap);
    const result: Vec4 = openSimplex2SDerivativesPart(position.clone()).add(
        openSimplex2SDerivativesPart(position.addAll(144.5)),
    );
    const result2: Vec3 = result.xyz.applyMat3(__openSimplex2OrthonormalMap);
    return new Vec4(result2.x, result2.y, result2.z, result.w);
}