import
{
    throwError,
} from "./dev.js";
import
{
    clamp,
} from "./math/index.js";


// =============================================================================
// Bit-Fiddling Functions
// =============================================================================


/// Converts a 32-bit float to a 16-bit float.
/// @param float32 A 32-bit float.
/// @returns A 16-bit float.
export function float32ToFloat16(float32: number): number
{
    let float32View = new Float32Array(1);
    let uint16View = new Uint16Array(float32View.buffer);

    float32View[0] = float32;
    const float32Int = uint16View[1] << 16 | uint16View[0];
    const sign = (float32Int >> 31) << 15;
    let exponent = ((float32Int >> 23) & 0xFF) - 127 + 15;
    let fraction = float32Int & 0x7FFFFF;

    if (exponent < 0) {
        exponent = 0;
        fraction = (fraction | 0x800000) >> (1 - exponent);
    } else if (exponent > 0x1F) {
        exponent = 0x1F;
        fraction = 0;
    }

    return sign | (exponent << 10) | (fraction >> 13);
}


/// Packs three 10-bit + one 2-bit unsigned integers into a 32-bit unsigned integer.
export function encodeU2101010REV(r: number, g: number, b: number, a: number): number // UNTESTED
{
    return (clamp(Math.round(a), 0, 3) << 30)
        | (clamp(Math.round(b), 0, 1023) << 20)
        | (clamp(Math.round(g), 0, 1023) << 10)
        | clamp(Math.round(r), 0, 1023);
}


/// Packs three 10-bit + one 2-bit signed integers into a 32-bit unsigned integer.
export function encodeI2101010REV(r: number, g: number, b: number, a: number): number // UNTESTED
{
    return Math.sign(a) << 31 | (clamp(Math.round(Math.abs(a)), 0, 1) << 30)
        | Math.sign(b) << 29 | (clamp(Math.round(Math.abs(b)), 0, 511) << 20)
        | Math.sign(g) << 19 | (clamp(Math.round(Math.abs(g)), 0, 511) << 10)
        | Math.sign(r) << 9 | clamp(Math.round(Math.abs(r)), 0, 511);
}


// =============================================================================
// Array Functions
// =============================================================================


/// Creates a new array with the given pattern repeated the given number of times.
export function repeat(pattern: any[], times: number): any[]
{
    return Array.from({ length: times }, () => pattern).flat();
}


/// Like Array.slice, but takes a width of the slice instead of and end position.
export function slice<T, N extends number>(array: Array<T>, start: number, width: N): Tuple<T, N>
{
    return array.slice(start, start + width) as Tuple<T, N>;
}


/// Interleave the given arrays, taking a number of elements (quantity) from each array in turn.
/// @param arrays An array of arrays to interleave.
/// @param quantities Either an array of quantities to take from each array,
/// or a single quantity to take from each array. Defaults to 1.
/// @returns A new array with the interleaved values.
export function interleaveArrays(arrays: any[][], quantities: number | number[] = 1): any[]
{
    // Ensure that all arrays are the same size.
    if (arrays.length === 0) {
        return [];
    }

    // If there is only one array, return it.
    if (arrays.length === 1) {
        return arrays[0];
    }

    // Ensure that quantities is an array of the correct size.
    if (!Array.isArray(quantities)) {
        quantities = repeat([quantities], arrays.length);
    } else if (quantities.length !== arrays.length) {
        throwError(() => `'quantities' must be either a number or an array with the same length as 'arrays'.\n` +
            `    'quantities' length: ${(quantities as number[]).length}\n` +
            `    'arrays' length: ${arrays.length}`
        );
    }

    // Ensure that the every quantity is valid.
    const bandCount = arrays[0].length / quantities[0];
    for (let i = 0; i < arrays.length; i++) {
        const quantity = quantities[i];
        if (quantity < 1) {
            throwError(() => `'quantity' must be greater than 0, but the value at index ${i} is ${quantity}`);
        }
        if (quantity % 1 !== 0) {
            throwError(() => `'quantity' must be an integer, but the value at index ${i} is ${quantity}`);
        }
        if (arrays[i].length % quantity !== 0) {
            throwError(() => `The length of the corresponding array must be a multiple of 'quantity'\n` +
                `    but the quantity at index ${i} is ${quantity}\n` +
                `    whereas the length of the corresponding array is ${arrays[i].length}`
            );
        }
        if (arrays[i].length / quantity !== bandCount) {
            throwError(() => `All arrays must have the same number of quantities,\n` +
                `    but array ${i} of size ${arrays[i].length} contains ${arrays[i].length / quantity} times ${quantity} quantities,\n` +
                `    whereas the first array conttains ${arrays[0].length / quantity} times ${(quantities as number[])[0]} quantities.`
            );
        }
    }

    // Interleave the arrays.
    const interleaved: any[] = [];
    for (let band = 0; band < bandCount; band++) {
        for (let arrayIndex = 0; arrayIndex < arrays.length; arrayIndex++) {
            const array = arrays[arrayIndex];
            const quantity = quantities[arrayIndex];
            interleaved.push(...array.slice(band * quantity, (band + 1) * quantity));
        }
    }

    return interleaved;
}


// =============================================================================
// WebGL Functions
// =============================================================================


/// Resets the given WebGL context to its initial state.
/// Copied wholesale from https://github.com/KhronosGroup/WebGLDeveloperTools/blob/main/src/debug/webgl-debug.js
export function resetContext(ctx: WebGL2RenderingContext)
{
    const isWebGL2RenderingContext = !!ctx.createTransformFeedback;

    if (isWebGL2RenderingContext) {
        ctx.bindVertexArray(null);
    }

    const numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
    const tmp = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
    for (let ii = 0; ii < numAttribs; ++ii) {
        ctx.disableVertexAttribArray(ii);
        ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
        ctx.vertexAttrib1f(ii, 0);
        if (isWebGL2RenderingContext) {
            ctx.vertexAttribDivisor(ii, 0);
        }
    }
    ctx.deleteBuffer(tmp);

    const numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
    for (let ii = 0; ii < numTextureUnits; ++ii) {
        ctx.activeTexture(ctx.TEXTURE0 + ii);
        ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
        if (isWebGL2RenderingContext) {
            ctx.bindTexture(ctx.TEXTURE_2D_ARRAY, null);
            ctx.bindTexture(ctx.TEXTURE_3D, null);
            ctx.bindSampler(ii, null);
        }
    }

    ctx.activeTexture(ctx.TEXTURE0);
    ctx.useProgram(null);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
    ctx.disable(ctx.BLEND);
    ctx.disable(ctx.CULL_FACE);
    ctx.disable(ctx.DEPTH_TEST);
    ctx.disable(ctx.DITHER);
    ctx.disable(ctx.SCISSOR_TEST);
    ctx.blendColor(0, 0, 0, 0);
    ctx.blendEquation(ctx.FUNC_ADD);
    ctx.blendFunc(ctx.ONE, ctx.ZERO);
    ctx.clearColor(0, 0, 0, 0);
    ctx.clearDepth(1);
    ctx.clearStencil(-1);
    ctx.colorMask(true, true, true, true);
    ctx.cullFace(ctx.BACK);
    ctx.depthFunc(ctx.LESS);
    ctx.depthMask(true);
    ctx.depthRange(0, 1);
    ctx.frontFace(ctx.CCW);
    ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
    ctx.lineWidth(1);
    ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
    ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
    ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
    ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
    ctx.polygonOffset(0, 0);
    ctx.sampleCoverage(1, false);
    ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.stencilFunc(ctx.ALWAYS, 0, 0xFFFFFFFF);
    ctx.stencilMask(0xFFFFFFFF);
    ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
    ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);

    if (isWebGL2RenderingContext) {
        ctx.drawBuffers([ctx.BACK]);
        ctx.readBuffer(ctx.BACK);
        ctx.bindBuffer(ctx.COPY_READ_BUFFER, null);
        ctx.bindBuffer(ctx.COPY_WRITE_BUFFER, null);
        ctx.bindBuffer(ctx.PIXEL_PACK_BUFFER, null);
        ctx.bindBuffer(ctx.PIXEL_UNPACK_BUFFER, null);
        const numTransformFeedbacks = ctx.getParameter(ctx.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS);
        for (let ii = 0; ii < numTransformFeedbacks; ++ii) {
            ctx.bindBufferBase(ctx.TRANSFORM_FEEDBACK_BUFFER, ii, null);
        }
        const numUBOs = ctx.getParameter(ctx.MAX_UNIFORM_BUFFER_BINDINGS);
        for (let ii = 0; ii < numUBOs; ++ii) {
            ctx.bindBufferBase(ctx.UNIFORM_BUFFER, ii, null);
        }
        ctx.disable(ctx.RASTERIZER_DISCARD);
        ctx.pixelStorei(ctx.UNPACK_IMAGE_HEIGHT, 0);
        ctx.pixelStorei(ctx.UNPACK_SKIP_IMAGES, 0);
        ctx.pixelStorei(ctx.UNPACK_ROW_LENGTH, 0);
        ctx.pixelStorei(ctx.UNPACK_SKIP_ROWS, 0);
        ctx.pixelStorei(ctx.UNPACK_SKIP_PIXELS, 0);
        ctx.pixelStorei(ctx.PACK_ROW_LENGTH, 0);
        ctx.pixelStorei(ctx.PACK_SKIP_ROWS, 0);
        ctx.pixelStorei(ctx.PACK_SKIP_PIXELS, 0);
        ctx.hint(ctx.FRAGMENT_SHADER_DERIVATIVE_HINT, ctx.DONT_CARE);
    }
}