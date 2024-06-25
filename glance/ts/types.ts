import type {
    Vec2,
    Vec3,
    Mat3,
    Mat4,
} from "./math/index.js";

/// Short name for the WebGL2 context.
export type WebGL2 = WebGL2RenderingContext;

// Attribute Buffer ========================================================= //

/// Data types for WebGL2 attributes.
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer#type
export const enum AttributeDataType
{
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
    HALF_FLOAT = 0x140B,
    INT_2_10_10_10_REV = 0x8D9F,
    UNSIGNED_INT_2_10_10_10_REV = 0x8368,
}

/// All WebGL integer Attribute data types.
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/vertexAttribIPointer#type
export const INTEGER_TYPES: Array<AttributeDataType> = [
    AttributeDataType.BYTE,
    AttributeDataType.UNSIGNED_BYTE,
    AttributeDataType.SHORT,
    AttributeDataType.UNSIGNED_SHORT,
    AttributeDataType.INT,
    AttributeDataType.UNSIGNED_INT,
];

/// GLSL Attributes can be 1, 2, 3 or 4 dimensional.
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer#size
export type AttributeSize = 1 | 2 | 3 | 4;

/// Description of a single Attribute.
export type AttributeDescription = {
    /// WebGL data type of the Attribute.
    readonly type: AttributeDataType,

    /// Number of dimensions of the Attribute (the height of a vector/matrix).
    readonly height: AttributeSize,

    /// Number of locations used by the Attribute (the width of a matrix).
    readonly width: AttributeSize,

    /// Whether integral data should be normalized. Defaults to false.
    readonly normalized?: boolean,

    /// Attribute divisor, used for attribute instances. Defaults to zero.
    readonly divisor?: number,
};

/// A Vertex Buffer Object (VBO) containing Attributes.
export type AttributeBuffer = {
    /// The name of the Attribute Buffer.
    readonly name: string,

    /// The WebGL Vertex Buffer Object.
    readonly glObject: WebGLBuffer,

    /// The number of Vertices defined in the buffer.
    readonly size: number,

    /// Interleaved Attributes defined in the buffer. Addressable by name.
    readonly attributes: ReadonlyMap<string, AttributeDescription>,
};

/// Reference to a single Attribute in an Attribute Buffer.
export type AttributeReference = {
    /// The Buffer containing this Attribute.
    readonly buffer: AttributeBuffer,

    /// The name of the Attribute in the Buffer.
    readonly name: string,
};

// Index Buffer ============================================================= //

/// Data types for WebGL2 indices.
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements#type
export const enum IndexDataType
{
    UNSIGNED_BYTE = 0x1401,
    UNSIGNED_SHORT = 0x1403,
    UNSIGNED_INT = 0x1405,
}

/// A Index Buffer Object (IBO) for drawing faces.
export type IndexBuffer = {
    /// The WebGL Vertex Buffer Object.
    readonly glObject: WebGLBuffer,

    /// The data type of an index.
    readonly type: IndexDataType,

    /// The number of Indices in the buffer.
    readonly size: number,
};

// VAO ====================================================================== //

/// A WebGL Vertex Array Object (VAO).
export type VAO = {
    /// The name of the VAO.
    readonly name: string,

    /// The WebGL Vertex Array Object.
    readonly glObject: WebGLVertexArrayObject,

    /// The Index Buffer Object.
    readonly ibo: IndexBuffer,

    /// The Attribute Bindings.
    readonly attributes: ReadonlyMap<AttributeLocation, AttributeReference>,
};

// Texture ================================================================== //

/// WebGL Texture targets.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture#target
export const enum TextureTarget
{
    TEXTURE_2D = 0x0DE1,
    TEXTURE_3D = 0x806F,
    TEXTURE_CUBE_MAP = 0x8513,
    TEXTURE_2D_ARRAY = 0x8C1A,
}

/// All WebGL Texture data targets.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D#target
/// and https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texImage3D#target
export const enum TextureDataTarget
{
    TEXTURE_2D = 0x0DE1,
    TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,
    TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,
    TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,
    TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,
    TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,
    TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A,
    TEXTURE_3D = 0x806F,
    TEXTURE_2D_ARRAY = 0x8C1A,
}

/// Valid values for the srcData type parameter of texImage2D and texImage3D.
/// See https://registry.khronos.org/webgl/specs/latest/2.0/#3.7.6
/// Actually, I have removed the signed integer types, because they do not
/// appear in the table of valid internalFormat, format and type combinations as
/// seen here: https://registry.khronos.org/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
/// This might be an oversight in the WebGL2 spec, but I am not sure.
/// I also removed the FLOAT_32_UNSIGNED_INT_24_8_REV type because it too is
/// missing from the table.
export const enum TextureSrcDataType
{
    UNSIGNED_BYTE = 0x1401,
    UNSIGNED_SHORT = 0x1403,
    UNSIGNED_SHORT_5_6_5 = 0x8363,
    UNSIGNED_SHORT_5_5_5_1 = 0x8034,
    UNSIGNED_SHORT_4_4_4_4 = 0x8033,
    UNSIGNED_INT = 0x1405,
    UNSIGNED_INT_5_9_9_9_REV = 0x8C3E,
    UNSIGNED_INT_2_10_10_10_REV = 0x8368,
    UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B,
    UNSIGNED_INT_24_8 = 0x84FA,
    HALF_FLOAT = 0x140B,
    FLOAT = 0x14,
}

/// Valid values for the internalFormat parameter of texStorage2D and texStorage3D.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D#internalformat
/// In WebGL1, one could also "unsized" formats like RGB, RGBA, LUMINANCE, etc.
/// but I will ignore them.
/// The MDN page is missing RGB10_A2, but it is in the WebGL2 spec...
/// Also, I am ignoring the compressed formats for now.
/// I am however including some depth formats as they appear to be valid and are
/// required for shadow mapping.
export const enum TextureInternalFormat
{
    R8 = 0x8229,
    R16F = 0x822D,
    R32F = 0x822E,
    R8UI = 0x8232,
    RG8 = 0x822B,
    RG16F = 0x822F,
    RG32F = 0x8230,
    RG8UI = 0x8238,
    RGB8 = 0x8051,
    SRGB8 = 0x8C41,
    RGB565 = 0x8D62,
    R11F_G11F_B10F = 0x8C3A,
    RGB9_E5 = 0x8C3D,
    RGB16F = 0x881B,
    RGB32F = 0x8815,
    RGB8UI = 0x8D7D,
    RGBA8 = 0x8058,
    SRGB8_ALPHA8 = 0x8C43,
    RGB5_A1 = 0x8057,
    RGBA4 = 0x8056,
    RGB10_A2 = 0x8059,
    RGBA16F = 0x881A,
    RGBA32F = 0x8814,
    RGBA8UI = 0x8D7C,
    DEPTH_COMPONENT16 = 0x81A5,
    DEPTH_COMPONENT24 = 0x81A6,
    DEPTH_COMPONENT32F = 0x8CAC,
    DEPTH24_STENCIL8 = 0x88F0,
    DEPTH32F_STENCIL8 = 0x8CAD,
    STENCIL_INDEX8 = 0x8D48,
}

/// Valid filter values for the min- and magFilter parameters of texParameteri.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#textures
export const enum TextureFilter
{
    NEAREST = 0x2600,
    LINEAR = 0x2601,
    NEAREST_MIPMAP_NEAREST = 0x2700,
    LINEAR_MIPMAP_NEAREST = 0x2701,
    NEAREST_MIPMAP_LINEAR = 0x2702,
    LINEAR_MIPMAP_LINEAR = 0x2703,
}

/// Valid filter values for the texture wrap parameters of texParameteri.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#textures
export const enum TextureWrap
{
    REPEAT = 0x2901,
    CLAMP_TO_EDGE = 0x812F,
    MIRRORED_REPEAT = 0x8370,
}

/// Anything but NONE implies that the TEXTURE_COMPARE_MODE of the texture is
/// set to COMPARE_REF_TO_TEXTURE.
/// Note that this requires the texture to be a depth texture.
/// See https://registry.khronos.org/OpenGL-Refpages/gl4/html/glTexParameter.xhtml
export const enum TextureCompareFunc
{
    // Disable depth comparison, implies TEXTURE_COMPARE_MODE = gl.NONE.
    NONE = 0x0000,
    // Always returns 0.
    NEVER = 0x0200,
    // Returns 1 if the new value is less than the stored value.
    LESS = 0x0201,
    // Returns 1 if the new value is equal to the stored value.
    EQUAL = 0x0202,
    // Returns 1 if the new value not greater than the stored value.
    LEQUAL = 0x0203,
    // Returns 1 if the new value is strictly greater than the stored value.
    GREATER = 0x0204,
    // Returns 1 if the new value is not equal to the stored value.
    NOTEQUAL = 0x0205,
    // Returns 1 if the new value is not less than the stored value.
    GEQUAL = 0x0206,
    // Always returns 1.
    ALWAYS = 0x0207,
}

/// A 2D, 3D or Cube Texture.
export type Texture = {
    /// The name of the Texture.
    readonly name: string,

    /// The WebGL texture object.
    readonly glObject: WebGLTexture,

    /// The target of the texture.
    readonly target: TextureTarget,

    /// The width of the texture. In Cubemaps this is the size of one face.
    readonly width: number,

    /// The height of the texture. In Cubemaps this is equal to the height.
    readonly height: number,

    /// The depth of the texture. 2D Textures have a depth of 1.
    readonly depth: number,

    /// The number of mipmap levels.
    readonly levels: number,

    /// The internal format of the texture.
    readonly internalFormat: TextureInternalFormat;

    /// Texture comparison format. Default is TextureCompareFunc.NONE.
    readonly compareFunc: TextureCompareFunc;

    /// The Renderbuffer attachment type.
    readonly attachmentType: AttachmentType.TEXTURE,
};

// Renderbuffer ============================================================= //

/// Valid values for the internalFormat parameter of renderbufferStorage.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage#internalformat
export const enum RenderbufferInternalFormat
{
    RGBA4 = 0x8056,
    RGB565 = 0x8D62,
    RGB5_A1 = 0x8057,
    DEPTH_COMPONENT16 = 0x81A5,
    STENCIL_INDEX8 = 0x8D48,
    DEPTH_STENCIL = 0x84F9,
    // WebGL2 only
    R8 = 0x8229,
    R8UI = 0x8232,
    R8I = 0x8231,
    R16UI = 0x8234,
    R16I = 0x8233,
    R32UI = 0x8236,
    R32I = 0x8235,
    RG8 = 0x822B,
    RG8UI = 0x8238,
    RG8I = 0x8237,
    RG16UI = 0x823A,
    RG16I = 0x8239,
    RG32UI = 0x823C,
    RG32I = 0x823B,
    RGB8 = 0x8051,
    RGBA8 = 0x8058,
    SRGB8_ALPHA8 = 0x8C43,
    RGB10_A2 = 0x8059,
    RGBA8UI = 0x8D7C,
    RGBA8I = 0x8D8E,
    RGB10_A2UI = 0x906F,
    RGBA16UI = 0x8D76,
    RGBA16I = 0x8D88,
    RGBA32I = 0x8D82,
    RGBA32UI = 0x8D70,
    DEPTH_COMPONENT24 = 0x81A6,
    DEPTH_COMPONENT32F = 0x8CAC,
    DEPTH24_STENCIL8 = 0x88F0,
    DEPTH32F_STENCIL8 = 0x8CAD,
    // WebGL2 + EXT_color_buffer_float only
    R16F = 0x822D,
    RG16F = 0x822F,
    RGBA16F = 0x881A,
    R32F = 0x822E,
    RG32F = 0x8230,
    RGBA32F = 0x8814,
    R11F_G11F_B10F = 0x8C3A,
}

/// A WebGL Renderbuffer.
export type Renderbuffer = {
    /// The name of the Renderbuffer.
    readonly name: string,

    /// The WebGL Renderbuffer Object.
    readonly glObject: WebGLRenderbuffer,

    /// The width of the Renderbuffer.
    readonly width: number,

    /// The height of the Renderbuffer.
    readonly height: number,

    /// The internal format of the Renderbuffer.
    readonly internalFormat: RenderbufferInternalFormat;

    /// The Renderbuffer attachment type.
    readonly attachmentType: AttachmentType.RENDERBUFFER,
};

// Framebuffer ============================================================== //

/// Attachment type for the Framebuffer.
export const enum AttachmentType
{
    TEXTURE = 1,
    RENDERBUFFER = 2,
}

/// A single Attachment for the Framebuffer.
export type FramebufferAttachment = Texture | Renderbuffer;

/// Description of an attachment for the Framebuffer.
export type AttachmentDefinition = {
    /// The attachment.
    readonly attachment: Texture | Renderbuffer,

    /// Which mip-map to attach. Defaults to zero.
    readonly level?: number,

    /// Attachment target (only useful for cube maps).
    readonly target?: TextureDataTarget,

    /// Which layer to attach (only useful for 3D and 2D Array textures).
    readonly layer?: number,
};

/// A WebGL Framebuffer.
export type Framebuffer = {
    /// The name of the framebuffer
    readonly name: string,

    /// The WebGL framebuffer.
    readonly glObject: WebGLFramebuffer,

    /// Color attachements.
    readonly color: Array<AttachmentDefinition>,

    /// Depth attachment.
    readonly depth: AttachmentDefinition | null,

    /// Stencil attachment.
    readonly stencil: AttachmentDefinition | null,
};

// Shader =================================================================== //

/// WebGL2 Shader Types.
export const enum ShaderStage
{
    VERTEX = 0x8B31,
    FRAGMENT = 0x8B30,
}

/// A generic WebGL Shader.
export interface Shader
{
    /// The WebGL Vertex Shader Object. Is mutable so it can be deleted.
    glObject: WebGLShader | null, // TODO: no mutable state in the types please (apart from uniform values?)

    /// The shader source code.
    readonly source: string,
}

/// A WebGL Vertex Shader.
export type VertexShader = Shader &
{
    /// The Shader Stage.
    readonly stage: ShaderStage.VERTEX,
};

/// A WebGL Fragment Shader.
export type FragmentShader = Shader &
{
    /// The Shader Stage.
    readonly stage: ShaderStage.FRAGMENT,
};

// Shader Attribute ========================================================= //

/// The location of an Attribute in a Shader Program.
export type AttributeLocation = number;

/// Acceptable Vertex Shader Input (Attribute) types.
/// Note that `matnxm` means "A matrix with n columns and m rows"
/// See https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Matrices
/// See chapter 4.3.4 of:
///  https://registry.khronos.org/OpenGL/specs/es/3.0/GLSL_ES_Specification_3.00.pdf
export type GlslAttributeDataType =
    | "int" | "ivec2" | "ivec3" | "ivec4"
    | "uint" | "uvec2" | "uvec3" | "uvec4"
    | "float" | "vec2" | "vec3" | "vec4"
    | "mat2" | "mat2x2" | "mat2x3" | "mat2x4"
    | "mat3" | "mat3x2" | "mat3x3" | "mat3x4"
    | "mat4" | "mat4x2" | "mat4x3" | "mat4x4";

/// A per-Vertex Input to the Vertex Shader stage of a Shader Program.
export type ShaderAttribute = {
    /// Location of the Attribute in the Shader.
    readonly location: AttributeLocation,

    /// The GLSL data type of the Attribute.
    readonly type: GlslAttributeDataType,
};

// Shader Uniform =========================================================== //

/// Acceptable Uniform Shader Input types.
/// See chapter 4.3.5 of:
///  https://registry.khronos.org/OpenGL/specs/es/3.0/GLSL_ES_Specification_3.00.pdf
/// Note that this does not cover the case where a Uniform is a struct or an
/// array of structs. See:
///  https://www.khronos.org/opengl/wiki/Uniform_(GLSL)#Uniform_management
export type GlslUniformDataType = GlslAttributeDataType
    | "bool" | "bvec2" | "bvec3" | "bvec4"
    | "sampler2D" | "sampler2DArray" | "samplerCube" | "sampler3D"
    | "isampler2D" | "isampler2DArray" | "isamplerCube" | "isampler3D"
    | "usampler2D" | "usampler2DArray" | "usamplerCube" | "usampler3D"
    | "sampler2DShadow" | "sampler2DArrayShadow" | "samplerCubeShadow";

/// Any value that can be assigned to a Uniform.
export type UniformValue = number | Array<number> | Vec2 | Vec3 | Mat3 | Mat4;

/// A Uniform input to a Shader Program.
export type ShaderUniform = {
    /// The type of the uniform.
    readonly type: GlslUniformDataType,

    /// The location of the uniform in the shader program.
    readonly location: WebGLUniformLocation,

    /// The array size of the uniform (=1 if it is a scalar).
    readonly size: number,

    /// The last value of the uniform.
    /// This is used to avoid unnecessary updates.
    lastValue: UniformValue,

    /// The new value of the uniform, or null if it should not be updated.
    value: UniformValue | null,
    // TODO: you shouldn't update the value on the Shader, but only on the draw call!
    // And I am pretty sure that this "lastValue" thing is not needed because the driver
    // will avoid updating the uniform if the value is the same as the last time.
    // The Draw call should be the only mutable store, all other objects should be immutable.
    // TODO: In the same vein, remove all callbacks from the draw call an let the user
    // update the values directly in the main loop. This is easier to reason about, more
    // colocated in the code and probably more efficient as well.
};

// Shader Program =========================================================== //

/// A WebGL Shader Program.
export type ShaderProgram = {
    /// The name of the Shader Program.
    readonly name: string,

    /// The WebGL Shader Program Object.
    readonly glObject: WebGLProgram,

    /// The Vertex Shader.
    readonly vertexShader: VertexShader,

    /// The Fragment Shader.
    readonly fragmentShader: FragmentShader,

    /// Attributes of the Vertex Shader, addressable by name.
    readonly attributes: ReadonlyMap<string, ShaderAttribute>,

    /// Uniforms of the Shader Program, addressable by name.
    readonly uniforms: ReadonlyMap<string, ShaderUniform>,
};

// Draw Call ================================================================ //

/// The ID of a WebGL Texture Unit.
export type TextureUnitId = number;

/// A WebGL2 Texture Unit.
export type TextureUnit = {
    texture_2d?: Texture,
    texture_3d?: Texture,
    texture_cube?: Texture,
    texture_2d_array?: Texture,
};

/// Front-/Backface culling modes.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#culling
export const enum CullFace
{
    // Disable culling altogether.
    NONE = 0x0000,
    // Cull front faces.
    FRONT = 0x0404,
    // Cull back faces. The default.
    BACK = 0x0405,
    // Cull front and back faces.
    FRONT_AND_BACK = 0x0408,
}

export const enum DepthTest
{
    // Disable testing altogether, calls do not update the depth buffer.
    NONE = 0x0000,
    // Tests will never pass.
    NEVER = 0x0200,
    // Tests will pass if the new value is less than the stored value.
    LESS = 0x0201,
    // Tests will pass if the new value is equal to the stored value.
    EQUAL = 0x0202,
    // Tests will pass if the new value is less than or equal to the stored value.
    LEQUAL = 0x0203,
    // Tests will pass if the new value is greater than the stored value.
    GREATER = 0x0204,
    // Tests will pass if the new value is not equal to the stored value.
    NOTEQUAL = 0x0205,
    // Tests will pass if the new value is greater than or equal to the stored value.
    GEQUAL = 0x0206,
    // Tests will always pass. The default.
    ALWAYS = 0x0207,
}

/// Blend function multipliers.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc
export const enum BlendFunc
{
    // Multiplies all colors by 0.
    ZERO = 0x0000,
    // Multiplies all colors by 1.
    ONE = 0x0001,
    // Multiplies all colors by the source colors.
    SRC_COLOR = 0x0300,
    // Multiplies all colors by 1 minus each source color.
    ONE_MINUS_SRC_COLOR = 0x0301,
    // Multiplies all colors by the destination color.
    DST_COLOR = 0x0306,
    // Multiplies all colors by 1 minus each destination color.
    ONE_MINUS_DST_COLOR = 0x0307,
    // Multiplies all colors by the source alpha value.
    SRC_ALPHA = 0x0302,
    // Multiplies all colors by 1 minus the source alpha value.
    ONE_MINUS_SRC_ALPHA = 0x0303,
    // Multiplies all colors by the destination alpha value.
    DST_ALPHA = 0x0304,
    // Multiplies all colors by 1 minus the destination alpha value.
    ONE_MINUS_DST_ALPHA = 0x0305,
    // Multiplies all colors by a constant color.
    CONSTANT_COLOR = 0x8001,
    // Multiplies all colors by 1 minus a constant color.
    ONE_MINUS_CONSTANT_COLOR = 0x8002,
    // Multiplies all colors by a constant alpha value.
    CONSTANT_ALPHA = 0x8003,
    // Multiplies all colors by 1 minus a constant alpha value.
    ONE_MINUS_CONSTANT_ALPHA = 0x8004,
    // Multiplies the RGB colors by the smaller of either the source alpha value
    // or the value of 1 minus the destination alpha value.
    // The alpha value is multiplied by 1.
    SRC_ALPHA_SATURATE = 0x0308,
}

/// Draw modes for drawElements.
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements#mode
export const enum DrawMode
{
    /// Draws individual points.
    POINTS = 0x0000,
    /// Draws lines between pairs of vertices.
    LINES = 0x0001,
    /// Draws a straight line to the next vertex, and connects the last vertex to the first.
    LINE_LOOP = 0x0002,
    /// Draws a straight line to the next vertex.
    LINE_STRIP = 0x0003,
    /// Draws triangles between triples of vertices (default).
    TRIANGLES = 0x0004,
    /// Draws a triangle between the first vertex and the last two vertices.
    TRIANGLE_STRIP = 0x0005,
}

/// Callback type to update a uniform value prior to a draw call.
export type UniformUpdateCallback = (args: { time: number; }) => UniformValue;

/// Everything needed to define and execute a WebGL Draw Call.
export type DrawCall = {
    /// The Shader Program to use.
    readonly program: ShaderProgram,

    /// The Vertex Array Object to use.
    readonly vao: VAO,

    /// The number of indices to draw.
    readonly count: number,

    /// The offset in the index buffer.
    readonly offset: number,

    /// Callbacks to update uniforms before drawing.
    readonly uniforms: ReadonlyMap<string, UniformUpdateCallback>,

    /// Texture Unit bindings.
    readonly textures: ReadonlyMap<TextureUnitId, TextureUnit>,

    /// The front-/backface culling mode.
    readonly cullFace: CullFace,

    /// The depth test mode.
    readonly depthTest: DepthTest,

    /// The blend function.
    readonly blendFunc: [BlendFunc, BlendFunc] | [BlendFunc, BlendFunc, BlendFunc, BlendFunc],

    /// The number of instances to draw.
    readonly instances: number | (() => number),

    /// Whether the draw call should update the render buffer.
    readonly updateDepthBuffer: boolean,

    /// The draw mode (triangles by default).
    readonly drawMode: DrawMode,

    /// Whether the draw call is enabled.
    readonly enabled?: (time: number) => boolean,
};

// WebGL Constants ========================================================== //

/// WebGL2 Buffer Usage.
/// See: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData#usage
export const enum BufferUsage
{
    // The contents of the buffer are likely to be used often and not change often.
    STATIC_DRAW = 0x88E4,
    // The contents of the buffer are likely to not be used often.
    STREAM_DRAW = 0x88E0,
    // The contents of the buffer are likely to be used often and change often.
    DYNAMIC_DRAW = 0x88E8,

    // The contents are intended to be specified once by reading data from WebGL, and queried many times by the application.
    STATIC_READ = 0x88E5,
    // The contents are intended to be respecified repeatedly by reading data from WebGL, and queried many times by the application.
    DYNAMIC_READ = 0x88E9,
    // The contents are intended to be specified once by reading data from WebGL, and queried at most a few times by the application
    STREAM_READ = 0x88E1,
    // The contents are intended to be specified once by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.
    STATIC_COPY = 0x88E6,
    // The contents are intended to be respecified repeatedly by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.
    DYNAMIC_COPY = 0x88EA,
    // The contents are intended to be specified once by reading data from WebGL, and used at most a few times as the source for WebGL drawing and image specification commands.
    STREAM_COPY = 0x88E2,
}

/// GLSL data precisions.
export type GlslPrecision = "lowp" | "mediump" | "highp";