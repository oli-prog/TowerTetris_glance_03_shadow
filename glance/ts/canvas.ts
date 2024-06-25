import
{
    type Texture,
    type WebGL2,
    TextureInternalFormat,
    TextureTarget,
} from "./types.js";
import
{
    createTexture,
} from "./core.js";


/// Creates a texture that can be used as a render target for a 2D Context.
export function createCanvasTexture(
    args: {
        gl: WebGL2,
        name: string,
        width?: number,
        height?: number,
        ctx?: OffscreenCanvasRenderingContext2D,
    }
): Texture
{
    if (args.ctx === undefined) {
        if (args.width === undefined || args.height === undefined) {
            throw new Error("Either ctx or width and height must be provided.");
        }
    }
    const width = args.width ?? args.ctx!.canvas.width;
    const height = args.height ?? args.ctx!.canvas.height;
    return createTexture(args.gl, args.name, width, height, TextureTarget.TEXTURE_2D, null, {
        useAnisotropy: true,
        internalFormat: TextureInternalFormat.RGBA8,
    });
}


/// Draw a canvas-filling grid into the given 2D context.
export function draw2DGrid(ctx: OffscreenCanvasRenderingContext2D, args: {
    gridSize?: number;
    axisWidth?: number;
    gridWidth?: number;
    axisColorX?: string;
    axisColorY?: string;
    gridColor?: string;
    axisAlpha?: number;
    gridAlpha?: number;
} = {})
{
    // Default values.
    const gridSize = args.gridSize ?? 10;
    const axisWidth = args.axisWidth ?? 2;
    const gridWidth = args.gridWidth ?? 1;
    const axisColorX = args.axisColorX ?? "rgb(255, 255, 255)";
    const axisColorY = args.axisColorY ?? "rgb(255, 255, 255)";
    const gridColor = args.gridColor ?? "rgb(255, 255, 255)";
    const axisAlpha = args.axisAlpha ?? 1.0;
    const gridAlpha = args.gridAlpha ?? 0.9;

    // Validate arguments.
    if (gridSize % 2 != 0) {
        throw new Error(`Grid Size must be an even number, got ${gridSize}`);
    }

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // Draw the grid.
    const offset = Math.max(axisWidth, gridWidth);
    const gridSpacing = (canvasWidth - offset * 2) / gridSize;
    ctx.lineWidth = gridWidth;
    ctx.lineCap = "round";
    ctx.globalAlpha = 1.0;

    ctx.strokeStyle = gridColor;
    for (let i = 0; i <= gridSize; i++) {
        const pos = offset + i * gridSpacing;
        // vertical
        ctx.beginPath();
        ctx.moveTo(pos, offset);
        ctx.lineTo(pos, canvasHeight - offset);
        ctx.stroke();
        // horizontal
        ctx.beginPath();
        ctx.moveTo(offset, pos);
        ctx.lineTo(canvasWidth - offset, pos);
        ctx.stroke();
    }
    // Apply a uniform alpha to the grid.
    if (gridAlpha < 1) {
        var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i + 3] *= gridAlpha;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Draw the axes.
    ctx.lineWidth = axisWidth;
    ctx.globalAlpha = axisAlpha;
    // x-axis
    ctx.strokeStyle = axisColorX;
    ctx.beginPath();
    ctx.moveTo(offset, canvasHeight / 2);
    ctx.lineTo(canvasWidth - offset, canvasHeight / 2);
    ctx.stroke();
    // y-axis
    ctx.strokeStyle = axisColorY;
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, offset);
    ctx.lineTo(canvasWidth / 2, canvasHeight - offset);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
}


/// Copy the contents of a 2D canvas into a texture.
/// Use `createCanvasTexture` to create a texture that can be used here.
export function copyCanvasToTexture(
    gl: WebGL2,
    ctx: OffscreenCanvasRenderingContext2D,
    texture: Texture,
)
{
    try {
        gl.bindTexture(gl.TEXTURE_2D, texture.glObject);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);
        gl.generateMipmap(gl.TEXTURE_2D);
    } finally {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}