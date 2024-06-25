export { createBox, createCircularPlane, createPlane, createScreenQuat, createSphere, createTorusKnot, getBaricentricCoordinates, loadObj, uniquifyVertices, };
import { EPSILON, Mat3, Vec2, Vec3, Quat, } from "../math/index.js";
import { assert, logInfo, logWarning, throwError, } from "../dev.js";
// =============================================================================
// Primitives
// =============================================================================
/// Create a 3D Plane geometry, spanning the XY plane.
/// @param name Name of the geometry.
/// @param width Width of the plane, default: 1.
/// @param height Height of the plane, default: 1.
/// @param widthSegments Number of horizontal segments. [1...), default: 1.
/// @param heightSegments Number of vertical segments. [1...), default: 1.
/// @param textureXform Transformation matrix for the texture coordinates. Default: identity.
/// @returns
function createPlane(name, options = {}) {
    // Validate the arguments.
    const width = Math.abs(options.width ?? 1);
    const height = Math.abs(options.height ?? 1);
    const widthSegments = Math.max(Math.round(options.widthSegments ?? 1), 1);
    const heightSegments = Math.max(Math.round(options.heightSegments ?? 1), 1);
    const textureXform = options.textureXform ?? Mat3.identity();
    // Initialize the arrays.
    const positions = new Array();
    const indices = new Array();
    const texCoords = new Array();
    const normals = new Array();
    const tangents = new Array();
    const texCoord = new Vec2();
    for (let y = 0; y <= heightSegments; y++) {
        const v = y / heightSegments;
        for (let x = 0; x <= widthSegments; x++) {
            const u = x / widthSegments;
            // positions
            positions.push((2 * u - 1) * width, (2 * v - 1) * height, 0);
            // indices
            if (x < widthSegments && y < heightSegments) {
                const a = (widthSegments + 1) * (y + 0) + (x + 0);
                const b = (widthSegments + 1) * (y + 0) + (x + 1);
                const c = (widthSegments + 1) * (y + 1) + (x + 1);
                const d = (widthSegments + 1) * (y + 1) + (x + 0);
                indices.push(a, b, d, b, c, d);
            }
            // normals
            normals.push(0, 0, 1);
            tangents.push(1, 0, 0);
            // texture coordinates
            texCoord.x = u;
            texCoord.y = v;
            texCoord.applyMat3(textureXform);
            texCoords.push(texCoord.x, texCoord.y);
        }
    }
    return {
        name,
        positions,
        indices,
        texCoords,
        normals,
        tangents,
    };
}
/// Create a 3D Circular Plane geometry, spanning the XY plane.
/// @param name Name of the geometry.
/// @param radius Radius of the circular plane, default: 1.
/// @param segments Number of segments around the perimeter of the circle, default: 32.
/// @param internalSegments Number of internal segments, default: 1.
/// @returns
function createCircularPlane(name, options = {}) {
    // Validate the arguments.
    const radius = Math.abs(options.radius ?? 1);
    const segments = Math.max(Math.round(options.segments ?? 32), 3);
    const internalSegments = Math.max(Math.round(options.internalSegments ?? 1), 1);
    // Initialize the arrays.
    const positions = new Array();
    const indices = new Array();
    const texCoords = new Array();
    const normals = new Array();
    const tangents = new Array();
    for (let i = 0; i <= internalSegments; i++) {
        const r = radius * (i / internalSegments);
        for (let j = 0; j <= segments; j++) {
            const theta = 2 * Math.PI * (j / segments);
            const x = -r * Math.cos(theta);
            const y = r * Math.sin(theta);
            // positions
            positions.push(x, y, 0);
            // normals
            normals.push(0, 0, 1);
            // tangents
            tangents.push(1, 0, 0);
            // texture coordinates
            texCoords.push((x / radius + 1) / 2, (y / radius + 1) / 2);
            // indices
            if (i < internalSegments && j < segments) {
                const a = i * (segments + 1) + j;
                const b = i * (segments + 1) + j + 1;
                const c = (i + 1) * (segments + 1) + j + 1;
                const d = (i + 1) * (segments + 1) + j;
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }
    }
    return {
        name,
        positions,
        indices,
        texCoords,
        normals,
        tangents,
    };
}
/// Creates a 3D box geometry.
/// @param name Name of the geometry.
/// @param width Width of the box, default: 1.
/// @param height Height of the box, default: 1.
/// @param depth Depth of the box, default: 1.
/// @param widthSegments Number of horizontal segments. [1...), default: 1.
/// @param heightSegments Number of vertical segments. [1...), default: 1.
/// @param depthSegments Number of depth segments. [1...), default: 1.
/// @param textureXform Transformation matrix for the texture coordinates. Default: identity.
/// @returns
function createBox(name, options = {}) {
    // Validate the arguments.
    const width = options.width ?? 1;
    const height = options.height ?? 1;
    const depth = options.depth ?? 1;
    const widthSegs = Math.max(1, Math.round(options.widthSegments ?? 1));
    const heightSegs = Math.max(1, Math.round(options.heightSegments ?? 1));
    const depthSegs = Math.max(1, Math.round(options.depthSegments ?? 1));
    const textureXform = options.textureXform ?? Mat3.identity();
    // Initialize the arrays.
    const positions = new Array();
    const indices = new Array();
    const texCoords = new Array();
    const normals = new Array();
    const tangents = new Array();
    // Build a single plane of the box.
    function buildPlane(width, height, depth, pWidthSegs, pHeightSegs, rotation) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const halfDepth = depth / 2;
        const segmentWidth = width / pWidthSegs;
        const segmentHeight = height / pHeightSegs;
        const indexOffset = positions.length / 3;
        const rowLength = pWidthSegs + 1;
        let position = new Vec3();
        let uvs = new Vec2();
        const normal = new Vec3(0, 0, 1).rotateQuat(rotation);
        const tangent = new Vec3(1, 0, 0).rotateQuat(rotation);
        for (let iy = 0; iy <= pHeightSegs; iy++) {
            const y = iy * segmentHeight - halfHeight;
            for (let ix = 0; ix <= pWidthSegs; ix++) {
                // position
                position.set(ix * segmentWidth - halfWidth, y, halfDepth).rotateQuat(rotation);
                positions.push(position.x, position.y, position.z);
                // texture coordinates
                uvs.set(ix / pWidthSegs, iy / pHeightSegs);
                uvs.applyMat3(textureXform);
                texCoords.push(uvs.x, uvs.y);
                // normal and tangent are the same for the entire plane
                normals.push(normal.x, normal.y, normal.z);
                tangents.push(tangent.x, tangent.y, tangent.z);
                // indices
                if (iy < pHeightSegs && ix < pWidthSegs) {
                    const a = indexOffset + ix + rowLength * iy;
                    const b = indexOffset + ix + rowLength * (iy + 1);
                    const c = indexOffset + (ix + 1) + rowLength * (iy + 1);
                    const d = indexOffset + (ix + 1) + rowLength * iy;
                    indices.push(a, d, b);
                    indices.push(b, d, c);
                }
            }
        }
    }
    // Build the planes of the box.
    const axis = new Vec3();
    const rot = new Quat();
    buildPlane(depth, height, width, depthSegs, heightSegs, rot.fromAxisAngle(axis.set(0, 1, 0), Math.PI / -2)); // +x
    buildPlane(depth, height, width, depthSegs, heightSegs, rot.fromAxisAngle(axis.set(0, 1, 0), Math.PI / 2)); // -x
    buildPlane(width, depth, height, widthSegs, depthSegs, rot.fromAxisAngle(axis.set(1, 0, 0), Math.PI / 2)); // +y
    buildPlane(width, depth, height, widthSegs, depthSegs, rot.fromAxisAngle(axis.set(1, 0, 0), Math.PI / -2)); // -y
    buildPlane(width, height, depth, widthSegs, heightSegs, rot.fromAxisAngle(axis.set(0, 1, 0), Math.PI)); // +z
    buildPlane(width, height, depth, widthSegs, heightSegs, rot.fromAxisAngle(axis.set(0, 1, 0), 0)); // -z
    return {
        name,
        positions,
        indices,
        texCoords,
        normals,
        tangents,
    };
}
/// Creates a 3D sphere geometry.
/// @param name Name of the geometry.
/// @param radius Radius of the sphere.
/// @param widthSegments Number of horizontal segments. [3...), default: 32.
/// @param heightSegments Number of vertical segments.  [2...), default: 16.
/// @param textureXform Transformation matrix for the texture coordinates. Default: identity.
/// @returns A sphere geometry.
function createSphere(name, options = {}) {
    // Validate the arguments.
    const radius = Math.max(0, options.radius ?? 1);
    const widthSegments = Math.max(3, Math.floor(options.widthSegments ?? 32));
    const heightSegments = Math.max(2, Math.floor(options.heightSegments ?? 16));
    const textureXform = options.textureXform ?? Mat3.identity();
    // Initialize the arrays.
    const positions = new Array();
    const indices = new Array();
    const texCoords = new Array();
    const normals = new Array();
    // Generate the vertex information.
    const texCoord = new Vec2();
    for (let lat = 0; lat <= heightSegments; lat++) {
        const theta = lat * Math.PI / heightSegments;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        // special case for the poles
        let uOffset = 0;
        if (lat === 0) {
            uOffset = 0.5 / widthSegments;
        }
        else if (lat === heightSegments) {
            uOffset = -0.5 / widthSegments;
        }
        for (let lon = 0; lon <= widthSegments; lon++) {
            const phi = lon * 2 * Math.PI / widthSegments;
            const x = Math.cos(phi) * sinTheta;
            const y = cosTheta;
            const z = Math.sin(phi) * sinTheta;
            texCoord.x = 1. - (lon / widthSegments) + uOffset;
            texCoord.y = 1. - (lat / heightSegments);
            texCoord.applyMat3(textureXform);
            positions.push(radius * x, radius * y, radius * z);
            normals.push(x, y, z);
            texCoords.push(texCoord.x, texCoord.y);
            if (lat < heightSegments && lon < widthSegments) {
                const first = (lat * (widthSegments + 1)) + lon;
                const second = first + widthSegments + 1;
                indices.push(first, first + 1, second);
                indices.push(second, first + 1, second + 1);
            }
        }
    }
    // The algorithm above generates degenerate faces and superfluous vertices
    // at the poles, so remove them.
    removeUnusedFaces(name, indices, positions);
    removeUnusedVertices(name, indices, positions, texCoords, normals);
    return {
        name,
        positions,
        indices,
        texCoords,
        normals,
        tangents: computeTangents(positions, texCoords, indices, normals),
    };
}
/// Creates a 2D screen-filling quad geometry.
/// @param name Name of the geometry.
/// @param in2D If true, the quad is created in 2D space, without normals and tangents. Default: false.
/// @param left Left edge of the quad in NDC, default: -1.
/// @param right Right edge of the quad in NDC, default: +1.
/// @param top Top edge of the quad in NDC, default: +1.
/// @param bottom Bottom edge of the quad in NDC, default: -1.
/// @returns
function createScreenQuat(name, options = {}) {
    const in2D = options.in2D ?? false;
    const left = options.left ?? -1;
    const right = options.right ?? +1;
    const top = options.top ?? +1;
    const bottom = options.bottom ?? -1;
    return {
        name,
        positions: in2D
            ? [left, bottom, left, top, right, top, right, bottom]
            : [left, bottom, 0, left, top, 0, right, top, 0, right, bottom, 0],
        indices: [0, 1, 2, 0, 2, 3],
        texCoords: [0, 0, 0, 1, 1, 1, 1, 0],
        normals: in2D ? [] : [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        tangents: in2D ? [] : [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
    };
}
/// Create torus knot geometry.
/// @param name Name of the geometry.
/// @param knotRadius Radius of the torus, default: 1. // TODO: this radius seems double than what I'd expect
/// @param tubeRadius Radius of the tube, default: 0.4.
/// @param tubeSegments Number of segments along the tube. [3...), default: 64.
/// @param radialSegments Number of segments around the tube. [3...), default: 8.
/// @param p The number of windings around the torus. [1...), default: 2.
/// @param q The number of windings around the tube. [1...), default: 3.
/// @returns A torus knot geometry.
function createTorusKnot(name, options = {}) {
    // Validate the arguments.
    const radius = Math.max(0, options.knotRadius ?? 1);
    const tube = Math.max(0, options.tubeRadius ?? 0.4);
    const tubularSegments = Math.max(3, Math.floor(options.tubeSegments ?? 64));
    const radialSegments = Math.max(3, Math.floor(options.radialSegments ?? 8));
    const p = Math.max(1, Math.floor(options.p ?? 2));
    const q = Math.max(1, Math.floor(options.q ?? 3));
    // buffers
    const positions = [];
    const indices = [];
    const normals = [];
    const texCoords = [];
    // This function calculates the current position on the torus curve.
    const calculatePositionOnCurve = (u, p, q, radius, position) => {
        const cu = Math.cos(u);
        const su = Math.sin(u);
        const quOverP = q / p * u;
        const cs = Math.cos(quOverP);
        position.x = radius * (2 + cs) * 0.5 * cu;
        position.y = radius * (2 + cs) * su * 0.5;
        position.z = radius * Math.sin(quOverP) * 0.5;
    };
    // helper variables
    const vertex = new Vec3();
    const P1 = new Vec3();
    let B = new Vec3();
    let T = new Vec3();
    let N = new Vec3();
    // generate vertices, normals and uvs
    for (let tubeIdx = 0; tubeIdx <= tubularSegments; ++tubeIdx) {
        // the radian "u" is used to calculate the position on the torus curve of the current tubular segment
        const u = tubeIdx / tubularSegments * p * Math.PI * 2;
        // now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
        // these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions
        calculatePositionOnCurve(u, p, q, radius, P1);
        calculatePositionOnCurve(u + 0.01, p, q, radius, N);
        // calculate orthonormal basis
        T.copy(N).subtract(P1);
        B.crossOf(T, N);
        N.crossOf(B, T);
        // normalize B and N. T can be ignored, we don't use it
        B.normalize();
        N.normalize();
        for (let radIdx = 0; radIdx <= radialSegments; ++radIdx) {
            // now calculate the vertices. they are nothing more than an extrusion of the torus curve.
            // because we extrude a shape in the xy-plane, there is no need to calculate a z-value.
            const v = radIdx / radialSegments * Math.PI * 2;
            const cx = -tube * Math.cos(v);
            const cy = tube * Math.sin(v);
            // now calculate the final vertex position.
            // first we orient the extrusion with our basis vectors, then we add it to the current position on the curve
            vertex.x = P1.x + (cx * N.x + cy * B.x);
            vertex.y = P1.y + (cx * N.y + cy * B.y);
            vertex.z = P1.z + (cx * N.z + cy * B.z);
            positions.push(vertex.x, vertex.y, vertex.z);
            // normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)
            vertex.subtract(P1).normalize();
            normals.push(vertex.x, vertex.y, vertex.z);
            // uv
            texCoords.push(tubeIdx / tubularSegments);
            texCoords.push(radIdx / radialSegments);
            // faces
            if (tubeIdx >= 1 && radIdx >= 1) {
                const a = (radialSegments + 1) * (tubeIdx - 1) + (radIdx - 1);
                const b = (radialSegments + 1) * tubeIdx + (radIdx - 1);
                const c = (radialSegments + 1) * tubeIdx + radIdx;
                const d = (radialSegments + 1) * (tubeIdx - 1) + radIdx;
                indices.push(a, b, d, b, c, d);
            }
        }
    }
    return {
        name,
        positions,
        indices,
        texCoords,
        normals,
        tangents: computeTangents(positions, texCoords, indices, normals),
    };
}
/// Load and parse an OBJ file into a raw `ObjData` object.
/// For now, we only support OBJ files with a single object as exported by Blender,
/// with 3-D positions, 2-D UV coordiantes, normals and triangulated faces.
/// @param text The text contents of the OBJ file.
/// @returns A promise that resolves to the parsed OBJ data.
function parseObj(text) {
    // Ignore comments, materials, groups, lines and smooth shading
    const ignoredLines = new Set(["#", "mtllib", "usemtl", "g", "l", "s", ""]);
    // Parse the OBJ contents
    let name = undefined;
    const positions = [];
    const splitIndices = [];
    const normals = [];
    const texCoords = [];
    const lines = text.split("\n");
    for (const [index, line] of lines.entries()) {
        const tokens = line.split(" ");
        const type = tokens[0];
        if (ignoredLines.has(type)) {
            continue;
        }
        else if (type === "o") {
            if (name === undefined) {
                name = tokens[1];
            }
            else {
                throwError(() => `Multiple object names defined in OBJ file (on line ${index})`);
            }
        }
        else if (type === "v") {
            positions.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
        }
        else if (type === "vn") {
            normals.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
        }
        else if (type === "vt") {
            texCoords.push(parseFloat(tokens[1]), parseFloat(tokens[2]));
        }
        else if (type === "f") {
            for (let i = 1; i <= 3; i++) {
                const face = tokens[i].split("/");
                const position = parseInt(face[0]) - 1;
                const texCoord = face.length > 1 && face[1] !== '' ? parseInt(face[1]) - 1 : position;
                const normal = face.length > 2 ? parseInt(face[2]) - 1 : position;
                splitIndices.push([position, texCoord, normal]);
            }
            // TODO: error if not triangulated
        }
        else {
            logWarning(() => `Unexpected OBJ token: "${type}" on line ${index}`);
        }
    }
    if (name === undefined) {
        throwError(() => `No object name defined in OBJ file: "${text}"`);
    }
    if (normals.length === 0) {
        console.log(`Calculating normals for object "${name}"`);
        normals.push(...computeNormals(positions, splitIndices.map((face) => face[2])));
    }
    if (texCoords.length === 0) {
        logWarning(() => `No texture coordinates defined for object "${name}"`);
        texCoords.push(...new Array(positions.length / 3 * 2).fill(0));
    }
    return {
        name,
        positions,
        texCoords,
        normals,
        splitIndices,
    };
}
/// Takes a raw OBJ data object and creates an attribute, and index buffer from it.
/// @param objData OBJ data to expand.
/// @param geometry Geometry object to fill.
function expandObj(objData, geometry) {
    let positions = geometry.positions;
    let texCoords = geometry.texCoords;
    let normals = geometry.normals;
    let indices = geometry.indices;
    // Expand the raw OBJ data into arrays of vertex attributes and indices.
    let vertIdx = 0;
    const knownIndices = new Map();
    for (const splitIndex of objData.splitIndices) {
        const vertexKey = splitIndex.join("|");
        // Detect duplicate vertices
        const existingVertex = knownIndices.get(vertexKey);
        if (existingVertex !== undefined) {
            indices.push(existingVertex);
            continue;
        }
        const [posIdx, uvIdx, normIdx] = splitIndex;
        // Create a new vertex
        const positionIndex = posIdx * 3;
        positions.push(...objData.positions.slice(positionIndex, positionIndex + 3));
        const uvIndex = uvIdx * 2;
        texCoords.push(...objData.texCoords.slice(uvIndex, uvIndex + 2));
        const normalIndex = normIdx * 3;
        normals.push(...objData.normals.slice(normalIndex, normalIndex + 3));
        indices.push(vertIdx);
        knownIndices.set(vertexKey, vertIdx);
        vertIdx++;
    }
    geometry.tangents = computeTangents(positions, texCoords, indices, normals);
}
/// Load an OBJ file.
/// @param path Location of the OBJ file.
/// @returns The loaded Geometry.
async function loadObj(path) {
    // Load the OBJ file (add proper CORS headers to load from other domains)
    const response = await fetch(path, { mode: "cors", method: "GET", headers: { "Content-Type": "text/plain" } });
    const text = await response.text();
    // Parse the OBJ file
    const objData = parseObj(text);
    // Expand the OBJ data
    const geometry = {
        name: objData.name,
        positions: [],
        indices: [],
        texCoords: [],
        normals: [],
        tangents: [],
    };
    expandObj(objData, geometry);
    // Remove unused vertices and faces.
    removeUnusedFaces(geometry.name, geometry.indices, geometry.positions);
    removeUnusedVertices(geometry.name, geometry.indices, geometry.positions, geometry.texCoords, geometry.normals, geometry.tangents);
    return geometry;
}
// =============================================================================
// Mesh Manipulation
// =============================================================================
/// Ensures that every vertex is only used by a single face.
/// @param geometry Geometry to uniquify.
function uniquifyVertices(geometry) {
    const uniqueIndices = new Set();
    const indexCount = geometry.indices.length;
    const originalVertexCount = geometry.positions.length / 3;
    let newVertexCount = originalVertexCount;
    for (let i = 0; i < indexCount; i++) {
        const index = geometry.indices[i];
        if (uniqueIndices.has(index)) {
            geometry.indices[i] = newVertexCount;
            uniqueIndices.add(newVertexCount++);
            geometry.positions.push(geometry.positions[index * 3], geometry.positions[index * 3 + 1], geometry.positions[index * 3 + 2]);
            geometry.texCoords.push(geometry.texCoords[index * 2], geometry.texCoords[index * 2 + 1]);
            geometry.normals.push(geometry.normals[index * 3], geometry.normals[index * 3 + 1], geometry.normals[index * 3 + 2]);
            geometry.tangents.push(geometry.tangents[index * 3], geometry.tangents[index * 3 + 1], geometry.tangents[index * 3 + 2]);
        }
        else {
            uniqueIndices.add(index);
        }
    }
    if (originalVertexCount !== newVertexCount) {
        logInfo(() => `Uniquified ${newVertexCount - originalVertexCount} vertices.`);
    }
}
// =============================================================================
// Barycentric Coordinates
// =============================================================================
/// Creates barycentric coordinates for a given geometry.
/// For this to work, the geometry must have only unique vertices.
/// @param geometry Geometry to create barycentric coordinates for.
/// @returns The barycentric coordinates.
function getBaricentricCoordinates(geometry) {
    // This won't work if not all vertices are unique.
    if (new Set(geometry.indices).size !== geometry.indices.length) {
        throwError(() => `The geometry "${geometry.name}" must have unique vertices to generate barycentric coordinates.`);
    }
    // Create the list of barycentric coordinates.
    const result = new Array(geometry.positions.length).fill(0);
    // Go through all faces and calculate the barycentric coordinates for each vertex.
    const indices = geometry.indices;
    for (let i = 0; i < geometry.indices.length; i += 3) {
        result[indices[i] * 3] = 1;
        result[indices[i + 1] * 3 + 1] = 1;
        result[indices[i + 2] * 3 + 2] = 1;
    }
    assert(() => [result.length === geometry.positions.length, `Failed to calculate barycentric coordinates for geometry "${geometry.name}"`]);
    return result;
}
// =============================================================================
// Helper
// =============================================================================
/// Checks for degenerate faces and removes them.
/// @param name Name of the modified geometry object.
/// @param indices Vertex indices.
/// @param positions 3D Vertex positions.
function removeUnusedFaces(name, indices, positions) {
    // TODO: this does not seem to work.
    // See the poles of a sphere with radius 0.5, widthSegments: 64, heightSegments: 32
    return;
    // // Validate the arguments.
    // if (positions.length % 3 !== 0) {
    //     throwError(() => `The positions array of "${name}" must have a length that is a multiple of 3, but it is ${positions.length}.`);
    // }
    // if (indices.length % 3 !== 0) {
    //     throwError(() => `The indices array of "${name}" must have a length that is a multiple of 3, but it is ${indices.length}.`);
    // }
    // // Go through all faces and check if they are degenerate.
    // const v0: Vec3 = new Vec3();
    // const e1: Vec3 = new Vec3();
    // const e2: Vec3 = new Vec3();
    // const faceCountBefore = indices.length / 3;
    // for (let i = 0; i < indices.length;) {
    //     // Edges of the face.
    //     v0.fromArray(positions, indices[i] * 3);
    //     e1.fromArray(positions, indices[i + 1] * 3).subtract(v0);
    //     e2.fromArray(positions, indices[i + 2] * 3).subtract(v0);
    //     // If the area of the face is zero, remove it.
    //     if (e1.cross(e2).lengthSq() < EPSILON) {
    //         indices.splice(i, 3);
    //     }
    //     // The face is valid, so move on to the next one.
    //     else {
    //         i += 3;
    //     }
    // }
    // const facesRemoved = faceCountBefore - indices.length / 3;
    // if (facesRemoved > 0) {
    //     logInfo(() => `Removed ${facesRemoved} degenerate faces from "${name}".`);
    // }
}
/// Removes all vertices that are not referenced by any face.
/// @param name Name of the modified geometry object.
/// @param indices Vertex indices.
/// @param positions 3D Vertex positions.
/// @param texCoords 2D Vertex texture coordinates.
/// @param normals 3D Vertex normals.
/// @param tangents 3D Vertex tangents.
function removeUnusedVertices(name, indices, positions, texCoords, normals, tangents) {
    // Validate the arguments.
    if (positions.length % 3 !== 0) {
        throwError(() => `The positions array of "${name}" must have a length that is a multiple of 3, but it is ${positions.length}.`);
    }
    if (indices.length % 3 !== 0) {
        throwError(() => `The indices array of "${name}" must have a length that is a multiple of 3, but it is ${indices.length}.`);
    }
    if (texCoords && texCoords.length % 2 !== 0) {
        throwError(() => `The UVs array of "${name}" must have a length that is a multiple of 2, but it is ${texCoords.length}.`);
    }
    if (normals && normals.length % 3 !== 0) {
        throwError(() => `The normals array of "${name}" must have a length that is a multiple of 3, but it is ${normals.length}.`);
    }
    if (tangents && tangents.length % 3 !== 0) {
        throwError(() => `The tangents array of "${name}" must have a length that is a multiple of 3, but it is ${tangents.length}.`);
    }
    const vertexCount = positions.length / 3;
    if (texCoords && texCoords.length / 2 !== vertexCount) {
        throwError(() => `The UVs array of "${name}" must have the same number of elements as the positions array.`);
    }
    if (normals && normals.length !== positions.length) {
        throwError(() => `The normals array of "${name}" must have the same number of elements as the positions array.`);
    }
    if (tangents && tangents.length !== positions.length) {
        throwError(() => `The tangents array of "${name}" must have the same number of elements as the positions array.`);
    }
    // Create a set of all used vertices.
    const usedIndices = new Set();
    for (const index of indices) {
        usedIndices.add(index);
    }
    // All vertices are used, so there is nothing to do.
    if (usedIndices.size === vertexCount) {
        return;
    }
    // Now create a list of all unused vertices.
    const unusedIndices = new Array();
    for (let i = 0; i < vertexCount; i++) {
        if (!usedIndices.has(i)) {
            unusedIndices.push(i);
        }
    }
    // Remove each unused vertex from the arrays, in reverse order to keep
    // the indices valid.
    for (let i = unusedIndices.length - 1; i >= 0; i--) {
        const unusedIndex = unusedIndices[i];
        positions.splice(unusedIndex * 3, 3);
        if (texCoords) {
            texCoords.splice(unusedIndex * 2, 2);
        }
        if (normals) {
            normals.splice(unusedIndex * 3, 3);
        }
        if (tangents) {
            tangents.splice(unusedIndex * 3, 3);
        }
    }
    // Update the indices.
    let indexOffsets = [];
    {
        let offset = 0;
        let nextUnusedIndex = unusedIndices[0];
        let unusedItr = 1;
        for (let i = 0; i < vertexCount; i++) {
            if (i === nextUnusedIndex) {
                offset++;
                nextUnusedIndex = unusedIndices[unusedItr++];
            }
            indexOffsets.push(offset);
        }
    }
    for (let i = 0; i < indices.length; i++) {
        indices[i] -= indexOffsets[indices[i]];
    }
    logInfo(() => `Removed ${unusedIndices.length} unused vertices from "${name}".`);
}
/// Given a set of vertex positions and indices, compute the vertex normals.
/// @param positions 3D Vertex positions.
/// @param indices Vertex indices.
/// @param normalize Whether to normalize the normals (default: true).
/// @returns 3D Normals for each vertex.
function computeNormals(positions, indices) {
    if (positions.length === 0 || indices.length === 0) {
        logWarning(() => "Skipping computation of normals for an empty mesh.");
        return [];
    }
    // Validate the arguments.
    if (indices.length % 3 !== 0) {
        throwError(() => "The indices array must be a multiple of 3.");
    }
    if (positions.length % 3 !== 0) {
        throwError(() => "The positions array must be a multiple of 3.");
    }
    // Initialize the normals to zero.
    const normals = new Array(positions.length).fill(0);
    // Compute the sum of all normals for each vertex.
    for (let i = 0; i < indices.length; i += 3) {
        // Indices of the vertices of the triangle.
        const i0 = indices[i] * 3;
        const i1 = indices[i + 1] * 3;
        const i2 = indices[i + 2] * 3;
        // Edges of the triangle.
        const v0x = positions[i0];
        const v0y = positions[i0 + 1];
        const v0z = positions[i0 + 2];
        const e1x = positions[i1] - v0x;
        const e1y = positions[i1 + 1] - v0y;
        const e1z = positions[i1 + 2] - v0z;
        const e2x = positions[i2] - v0x;
        const e2y = positions[i2 + 1] - v0y;
        const e2z = positions[i2 + 2] - v0z;
        // Cross product of the two edges.
        const nx = e1y * e2z - e1z * e2y;
        const ny = e1z * e2x - e1x * e2z;
        const nz = e1x * e2y - e1y * e2x;
        // Add the normal to the three vertices.
        normals[i0] += nx;
        normals[i0 + 1] += ny;
        normals[i0 + 2] += nz;
        normals[i1] += nx;
        normals[i1 + 1] += ny;
        normals[i1 + 2] += nz;
        normals[i2] += nx;
        normals[i2 + 1] += ny;
        normals[i2 + 2] += nz;
    }
    // Normalize the normal, averaging the sum of its surface normals.
    for (let i = 0; i < normals.length; i += 3) {
        const length = Math.hypot(normals[i], normals[i + 1], normals[i + 2]);
        if (length === 0) {
            logWarning(() => `Cannot generate normal for vertex ${i / 3} because it is not part of a face.`);
            continue;
        }
        normals[i] /= length;
        normals[i + 1] /= length;
        normals[i + 2] /= length;
    }
    return normals;
}
/// Computes the tangents for a mesh.
/// @param positions 3D Vertex positions.
/// @param texCoords 2D Vertex texture coordinates.
/// @param indices Vertex indices.
/// @param normals 3D Vertex normals for better accuracy (optional).
/// @returns 3D Tangents for each vertex.
function computeTangents(positions, texCoords, indices, normals) {
    if (positions.length === 0 || texCoords.length === 0 || indices.length === 0) {
        logWarning(() => "Skipping computation of tangents for an empty mesh.");
        return [];
    }
    // Validate the arguments.
    if (indices.length % 3 !== 0) {
        throwError(() => "The indices array must be a multiple of 3.");
    }
    if (positions.length % 3 !== 0) {
        throwError(() => "The positions array must be a multiple of 3.");
    }
    if (texCoords.length % 2 !== 0) {
        throwError(() => "The UVs array must be a multiple of 2.");
    }
    if (normals && normals.length % 3 !== 0) {
        throwError(() => "The normals array must be a multiple of 3.");
    }
    const vertexCount = positions.length / 3;
    if (texCoords.length / 2 !== vertexCount) {
        throwError(() => "The UVs array must have the same number of elements as the positions array.");
    }
    if (normals && normals.length !== positions.length) {
        throwError(() => "The normals array must have the same number of elements as the positions array.");
    }
    // Initialize the tangets to zero.
    const tangents = Array(positions.length).fill(0);
    // Calculate the tangents for each triangle.
    for (let faceIndex = 0; faceIndex < indices.length; faceIndex += 3) {
        const i0 = indices[faceIndex];
        const i1 = indices[faceIndex + 1];
        const i2 = indices[faceIndex + 2];
        // Edges of the triangle.
        const v0x = positions[i0 * 3];
        const v0y = positions[i0 * 3 + 1];
        const v0z = positions[i0 * 3 + 2];
        const e1x = positions[i1 * 3] - v0x;
        const e1y = positions[i1 * 3 + 1] - v0y;
        const e1z = positions[i1 * 3 + 2] - v0z;
        const e2x = positions[i2 * 3] - v0x;
        const e2y = positions[i2 * 3 + 1] - v0y;
        const e2z = positions[i2 * 3 + 2] - v0z;
        // UV edges.
        const uv0x = texCoords[i0 * 2];
        const uv0y = texCoords[i0 * 2 + 1];
        const euv1x = texCoords[i1 * 2] - uv0x;
        const euv1y = texCoords[i1 * 2 + 1] - uv0y;
        const euv2x = texCoords[i2 * 2] - uv0x;
        const euv2y = texCoords[i2 * 2 + 1] - uv0y;
        // Calculate the tangent.
        const r = 1.0 / (euv1x * euv2y - euv2x * euv1y);
        const tx = (euv2y * e1x - euv1y * e2x) * r;
        const ty = (euv2y * e1y - euv1y * e2y) * r;
        const tz = (euv2y * e1z - euv1y * e2z) * r;
        // Add the tangent to the three vertices.
        tangents[i0 * 3] += tx;
        tangents[i0 * 3 + 1] += ty;
        tangents[i0 * 3 + 2] += tz;
        tangents[i1 * 3] += tx;
        tangents[i1 * 3 + 1] += ty;
        tangents[i1 * 3 + 2] += tz;
        tangents[i2 * 3] += tx;
        tangents[i2 * 3 + 1] += ty;
        tangents[i2 * 3 + 2] += tz;
    }
    // Normalize the tangent, optionally using the normal to ensure orthogonality.
    if (normals) {
        for (let i = 0; i < tangents.length; i += 3) {
            let tx = tangents[i], ty = tangents[i + 1], tz = tangents[i + 2];
            let nx = normals[i], ny = normals[i + 1], nz = normals[i + 2];
            const dot = nx * tx + ny * ty + nz * tz;
            tx -= dot * nx;
            ty -= dot * ny;
            tz -= dot * nz;
            const length = Math.hypot(tx, ty, tz);
            if (length === 0) {
                // TODO: re-enable warning once the unused-vertex issue is fixed
                // logWarning(() => `Cannot generate tangent for vertex ${i / 3} because it is not part of a face.`);
                continue;
            }
            tangents[i] = tx / length;
            tangents[i + 1] = ty / length;
            tangents[i + 2] = tz / length;
        }
    }
    else {
        for (let i = 0; i < tangents.length; i += 3) {
            const length = Math.hypot(tangents[i], tangents[i + 1], tangents[i + 2]);
            if (length === 0) {
                // logWarning(() => `Cannot generate tangent for vertex ${i / 3} because it is not part of a face.`);
                continue;
            }
            tangents[i] /= length;
            tangents[i + 1] /= length;
            tangents[i + 2] /= length;
        }
    }
    return tangents;
}
