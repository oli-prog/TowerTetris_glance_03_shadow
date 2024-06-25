// Attribute Buffer ========================================================= //
/// Data types for WebGL2 attributes.
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer#type
export var AttributeDataType;
(function (AttributeDataType) {
    AttributeDataType[AttributeDataType["BYTE"] = 5120] = "BYTE";
    AttributeDataType[AttributeDataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    AttributeDataType[AttributeDataType["SHORT"] = 5122] = "SHORT";
    AttributeDataType[AttributeDataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    AttributeDataType[AttributeDataType["INT"] = 5124] = "INT";
    AttributeDataType[AttributeDataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    AttributeDataType[AttributeDataType["FLOAT"] = 5126] = "FLOAT";
    AttributeDataType[AttributeDataType["HALF_FLOAT"] = 5131] = "HALF_FLOAT";
    AttributeDataType[AttributeDataType["INT_2_10_10_10_REV"] = 36255] = "INT_2_10_10_10_REV";
    AttributeDataType[AttributeDataType["UNSIGNED_INT_2_10_10_10_REV"] = 33640] = "UNSIGNED_INT_2_10_10_10_REV";
})(AttributeDataType || (AttributeDataType = {}));
/// All WebGL integer Attribute data types.
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/vertexAttribIPointer#type
export const INTEGER_TYPES = [
    AttributeDataType.BYTE,
    AttributeDataType.UNSIGNED_BYTE,
    AttributeDataType.SHORT,
    AttributeDataType.UNSIGNED_SHORT,
    AttributeDataType.INT,
    AttributeDataType.UNSIGNED_INT,
];
// Index Buffer ============================================================= //
/// Data types for WebGL2 indices.
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements#type
export var IndexDataType;
(function (IndexDataType) {
    IndexDataType[IndexDataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    IndexDataType[IndexDataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    IndexDataType[IndexDataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
})(IndexDataType || (IndexDataType = {}));
// Texture ================================================================== //
/// WebGL Texture targets.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture#target
export var TextureTarget;
(function (TextureTarget) {
    TextureTarget[TextureTarget["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
    TextureTarget[TextureTarget["TEXTURE_3D"] = 32879] = "TEXTURE_3D";
    TextureTarget[TextureTarget["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
    TextureTarget[TextureTarget["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
})(TextureTarget || (TextureTarget = {}));
/// All WebGL Texture data targets.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D#target
/// and https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texImage3D#target
export var TextureDataTarget;
(function (TextureDataTarget) {
    TextureDataTarget[TextureDataTarget["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
    TextureDataTarget[TextureDataTarget["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
    TextureDataTarget[TextureDataTarget["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
    TextureDataTarget[TextureDataTarget["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
    TextureDataTarget[TextureDataTarget["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
    TextureDataTarget[TextureDataTarget["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
    TextureDataTarget[TextureDataTarget["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
    TextureDataTarget[TextureDataTarget["TEXTURE_3D"] = 32879] = "TEXTURE_3D";
    TextureDataTarget[TextureDataTarget["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
})(TextureDataTarget || (TextureDataTarget = {}));
/// Valid values for the srcData type parameter of texImage2D and texImage3D.
/// See https://registry.khronos.org/webgl/specs/latest/2.0/#3.7.6
/// Actually, I have removed the signed integer types, because they do not
/// appear in the table of valid internalFormat, format and type combinations as
/// seen here: https://registry.khronos.org/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
/// This might be an oversight in the WebGL2 spec, but I am not sure.
/// I also removed the FLOAT_32_UNSIGNED_INT_24_8_REV type because it too is
/// missing from the table.
export var TextureSrcDataType;
(function (TextureSrcDataType) {
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_INT_5_9_9_9_REV"] = 35902] = "UNSIGNED_INT_5_9_9_9_REV";
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_INT_2_10_10_10_REV"] = 33640] = "UNSIGNED_INT_2_10_10_10_REV";
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_INT_10F_11F_11F_REV"] = 35899] = "UNSIGNED_INT_10F_11F_11F_REV";
    TextureSrcDataType[TextureSrcDataType["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
    TextureSrcDataType[TextureSrcDataType["HALF_FLOAT"] = 5131] = "HALF_FLOAT";
    TextureSrcDataType[TextureSrcDataType["FLOAT"] = 20] = "FLOAT";
})(TextureSrcDataType || (TextureSrcDataType = {}));
/// Valid values for the internalFormat parameter of texStorage2D and texStorage3D.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D#internalformat
/// In WebGL1, one could also "unsized" formats like RGB, RGBA, LUMINANCE, etc.
/// but I will ignore them.
/// The MDN page is missing RGB10_A2, but it is in the WebGL2 spec...
/// Also, I am ignoring the compressed formats for now.
/// I am however including some depth formats as they appear to be valid and are
/// required for shadow mapping.
export var TextureInternalFormat;
(function (TextureInternalFormat) {
    TextureInternalFormat[TextureInternalFormat["R8"] = 33321] = "R8";
    TextureInternalFormat[TextureInternalFormat["R16F"] = 33325] = "R16F";
    TextureInternalFormat[TextureInternalFormat["R32F"] = 33326] = "R32F";
    TextureInternalFormat[TextureInternalFormat["R8UI"] = 33330] = "R8UI";
    TextureInternalFormat[TextureInternalFormat["RG8"] = 33323] = "RG8";
    TextureInternalFormat[TextureInternalFormat["RG16F"] = 33327] = "RG16F";
    TextureInternalFormat[TextureInternalFormat["RG32F"] = 33328] = "RG32F";
    TextureInternalFormat[TextureInternalFormat["RG8UI"] = 33336] = "RG8UI";
    TextureInternalFormat[TextureInternalFormat["RGB8"] = 32849] = "RGB8";
    TextureInternalFormat[TextureInternalFormat["SRGB8"] = 35905] = "SRGB8";
    TextureInternalFormat[TextureInternalFormat["RGB565"] = 36194] = "RGB565";
    TextureInternalFormat[TextureInternalFormat["R11F_G11F_B10F"] = 35898] = "R11F_G11F_B10F";
    TextureInternalFormat[TextureInternalFormat["RGB9_E5"] = 35901] = "RGB9_E5";
    TextureInternalFormat[TextureInternalFormat["RGB16F"] = 34843] = "RGB16F";
    TextureInternalFormat[TextureInternalFormat["RGB32F"] = 34837] = "RGB32F";
    TextureInternalFormat[TextureInternalFormat["RGB8UI"] = 36221] = "RGB8UI";
    TextureInternalFormat[TextureInternalFormat["RGBA8"] = 32856] = "RGBA8";
    TextureInternalFormat[TextureInternalFormat["SRGB8_ALPHA8"] = 35907] = "SRGB8_ALPHA8";
    TextureInternalFormat[TextureInternalFormat["RGB5_A1"] = 32855] = "RGB5_A1";
    TextureInternalFormat[TextureInternalFormat["RGBA4"] = 32854] = "RGBA4";
    TextureInternalFormat[TextureInternalFormat["RGB10_A2"] = 32857] = "RGB10_A2";
    TextureInternalFormat[TextureInternalFormat["RGBA16F"] = 34842] = "RGBA16F";
    TextureInternalFormat[TextureInternalFormat["RGBA32F"] = 34836] = "RGBA32F";
    TextureInternalFormat[TextureInternalFormat["RGBA8UI"] = 36220] = "RGBA8UI";
    TextureInternalFormat[TextureInternalFormat["DEPTH_COMPONENT16"] = 33189] = "DEPTH_COMPONENT16";
    TextureInternalFormat[TextureInternalFormat["DEPTH_COMPONENT24"] = 33190] = "DEPTH_COMPONENT24";
    TextureInternalFormat[TextureInternalFormat["DEPTH_COMPONENT32F"] = 36012] = "DEPTH_COMPONENT32F";
    TextureInternalFormat[TextureInternalFormat["DEPTH24_STENCIL8"] = 35056] = "DEPTH24_STENCIL8";
    TextureInternalFormat[TextureInternalFormat["DEPTH32F_STENCIL8"] = 36013] = "DEPTH32F_STENCIL8";
    TextureInternalFormat[TextureInternalFormat["STENCIL_INDEX8"] = 36168] = "STENCIL_INDEX8";
})(TextureInternalFormat || (TextureInternalFormat = {}));
/// Valid filter values for the min- and magFilter parameters of texParameteri.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#textures
export var TextureFilter;
(function (TextureFilter) {
    TextureFilter[TextureFilter["NEAREST"] = 9728] = "NEAREST";
    TextureFilter[TextureFilter["LINEAR"] = 9729] = "LINEAR";
    TextureFilter[TextureFilter["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
    TextureFilter[TextureFilter["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
    TextureFilter[TextureFilter["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
    TextureFilter[TextureFilter["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
})(TextureFilter || (TextureFilter = {}));
/// Valid filter values for the texture wrap parameters of texParameteri.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#textures
export var TextureWrap;
(function (TextureWrap) {
    TextureWrap[TextureWrap["REPEAT"] = 10497] = "REPEAT";
    TextureWrap[TextureWrap["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
    TextureWrap[TextureWrap["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(TextureWrap || (TextureWrap = {}));
/// Anything but NONE implies that the TEXTURE_COMPARE_MODE of the texture is
/// set to COMPARE_REF_TO_TEXTURE.
/// Note that this requires the texture to be a depth texture.
/// See https://registry.khronos.org/OpenGL-Refpages/gl4/html/glTexParameter.xhtml
export var TextureCompareFunc;
(function (TextureCompareFunc) {
    // Disable depth comparison, implies TEXTURE_COMPARE_MODE = gl.NONE.
    TextureCompareFunc[TextureCompareFunc["NONE"] = 0] = "NONE";
    // Always returns 0.
    TextureCompareFunc[TextureCompareFunc["NEVER"] = 512] = "NEVER";
    // Returns 1 if the new value is less than the stored value.
    TextureCompareFunc[TextureCompareFunc["LESS"] = 513] = "LESS";
    // Returns 1 if the new value is equal to the stored value.
    TextureCompareFunc[TextureCompareFunc["EQUAL"] = 514] = "EQUAL";
    // Returns 1 if the new value not greater than the stored value.
    TextureCompareFunc[TextureCompareFunc["LEQUAL"] = 515] = "LEQUAL";
    // Returns 1 if the new value is strictly greater than the stored value.
    TextureCompareFunc[TextureCompareFunc["GREATER"] = 516] = "GREATER";
    // Returns 1 if the new value is not equal to the stored value.
    TextureCompareFunc[TextureCompareFunc["NOTEQUAL"] = 517] = "NOTEQUAL";
    // Returns 1 if the new value is not less than the stored value.
    TextureCompareFunc[TextureCompareFunc["GEQUAL"] = 518] = "GEQUAL";
    // Always returns 1.
    TextureCompareFunc[TextureCompareFunc["ALWAYS"] = 519] = "ALWAYS";
})(TextureCompareFunc || (TextureCompareFunc = {}));
// Renderbuffer ============================================================= //
/// Valid values for the internalFormat parameter of renderbufferStorage.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage#internalformat
export var RenderbufferInternalFormat;
(function (RenderbufferInternalFormat) {
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA4"] = 32854] = "RGBA4";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGB565"] = 36194] = "RGB565";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGB5_A1"] = 32855] = "RGB5_A1";
    RenderbufferInternalFormat[RenderbufferInternalFormat["DEPTH_COMPONENT16"] = 33189] = "DEPTH_COMPONENT16";
    RenderbufferInternalFormat[RenderbufferInternalFormat["STENCIL_INDEX8"] = 36168] = "STENCIL_INDEX8";
    RenderbufferInternalFormat[RenderbufferInternalFormat["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
    // WebGL2 only
    RenderbufferInternalFormat[RenderbufferInternalFormat["R8"] = 33321] = "R8";
    RenderbufferInternalFormat[RenderbufferInternalFormat["R8UI"] = 33330] = "R8UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["R8I"] = 33329] = "R8I";
    RenderbufferInternalFormat[RenderbufferInternalFormat["R16UI"] = 33332] = "R16UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["R16I"] = 33331] = "R16I";
    RenderbufferInternalFormat[RenderbufferInternalFormat["R32UI"] = 33334] = "R32UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["R32I"] = 33333] = "R32I";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RG8"] = 33323] = "RG8";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RG8UI"] = 33336] = "RG8UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RG8I"] = 33335] = "RG8I";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RG16UI"] = 33338] = "RG16UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RG16I"] = 33337] = "RG16I";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RG32UI"] = 33340] = "RG32UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RG32I"] = 33339] = "RG32I";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGB8"] = 32849] = "RGB8";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA8"] = 32856] = "RGBA8";
    RenderbufferInternalFormat[RenderbufferInternalFormat["SRGB8_ALPHA8"] = 35907] = "SRGB8_ALPHA8";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGB10_A2"] = 32857] = "RGB10_A2";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA8UI"] = 36220] = "RGBA8UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA8I"] = 36238] = "RGBA8I";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGB10_A2UI"] = 36975] = "RGB10_A2UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA16UI"] = 36214] = "RGBA16UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA16I"] = 36232] = "RGBA16I";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA32I"] = 36226] = "RGBA32I";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA32UI"] = 36208] = "RGBA32UI";
    RenderbufferInternalFormat[RenderbufferInternalFormat["DEPTH_COMPONENT24"] = 33190] = "DEPTH_COMPONENT24";
    RenderbufferInternalFormat[RenderbufferInternalFormat["DEPTH_COMPONENT32F"] = 36012] = "DEPTH_COMPONENT32F";
    RenderbufferInternalFormat[RenderbufferInternalFormat["DEPTH24_STENCIL8"] = 35056] = "DEPTH24_STENCIL8";
    RenderbufferInternalFormat[RenderbufferInternalFormat["DEPTH32F_STENCIL8"] = 36013] = "DEPTH32F_STENCIL8";
    // WebGL2 + EXT_color_buffer_float only
    RenderbufferInternalFormat[RenderbufferInternalFormat["R16F"] = 33325] = "R16F";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RG16F"] = 33327] = "RG16F";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA16F"] = 34842] = "RGBA16F";
    RenderbufferInternalFormat[RenderbufferInternalFormat["R32F"] = 33326] = "R32F";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RG32F"] = 33328] = "RG32F";
    RenderbufferInternalFormat[RenderbufferInternalFormat["RGBA32F"] = 34836] = "RGBA32F";
    RenderbufferInternalFormat[RenderbufferInternalFormat["R11F_G11F_B10F"] = 35898] = "R11F_G11F_B10F";
})(RenderbufferInternalFormat || (RenderbufferInternalFormat = {}));
// Framebuffer ============================================================== //
/// Attachment type for the Framebuffer.
export var AttachmentType;
(function (AttachmentType) {
    AttachmentType[AttachmentType["TEXTURE"] = 1] = "TEXTURE";
    AttachmentType[AttachmentType["RENDERBUFFER"] = 2] = "RENDERBUFFER";
})(AttachmentType || (AttachmentType = {}));
// Shader =================================================================== //
/// WebGL2 Shader Types.
export var ShaderStage;
(function (ShaderStage) {
    ShaderStage[ShaderStage["VERTEX"] = 35633] = "VERTEX";
    ShaderStage[ShaderStage["FRAGMENT"] = 35632] = "FRAGMENT";
})(ShaderStage || (ShaderStage = {}));
/// Front-/Backface culling modes.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#culling
export var CullFace;
(function (CullFace) {
    // Disable culling altogether.
    CullFace[CullFace["NONE"] = 0] = "NONE";
    // Cull front faces.
    CullFace[CullFace["FRONT"] = 1028] = "FRONT";
    // Cull back faces. The default.
    CullFace[CullFace["BACK"] = 1029] = "BACK";
    // Cull front and back faces.
    CullFace[CullFace["FRONT_AND_BACK"] = 1032] = "FRONT_AND_BACK";
})(CullFace || (CullFace = {}));
export var DepthTest;
(function (DepthTest) {
    // Disable testing altogether, calls do not update the depth buffer.
    DepthTest[DepthTest["NONE"] = 0] = "NONE";
    // Tests will never pass.
    DepthTest[DepthTest["NEVER"] = 512] = "NEVER";
    // Tests will pass if the new value is less than the stored value.
    DepthTest[DepthTest["LESS"] = 513] = "LESS";
    // Tests will pass if the new value is equal to the stored value.
    DepthTest[DepthTest["EQUAL"] = 514] = "EQUAL";
    // Tests will pass if the new value is less than or equal to the stored value.
    DepthTest[DepthTest["LEQUAL"] = 515] = "LEQUAL";
    // Tests will pass if the new value is greater than the stored value.
    DepthTest[DepthTest["GREATER"] = 516] = "GREATER";
    // Tests will pass if the new value is not equal to the stored value.
    DepthTest[DepthTest["NOTEQUAL"] = 517] = "NOTEQUAL";
    // Tests will pass if the new value is greater than or equal to the stored value.
    DepthTest[DepthTest["GEQUAL"] = 518] = "GEQUAL";
    // Tests will always pass. The default.
    DepthTest[DepthTest["ALWAYS"] = 519] = "ALWAYS";
})(DepthTest || (DepthTest = {}));
/// Blend function multipliers.
/// See https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc
export var BlendFunc;
(function (BlendFunc) {
    // Multiplies all colors by 0.
    BlendFunc[BlendFunc["ZERO"] = 0] = "ZERO";
    // Multiplies all colors by 1.
    BlendFunc[BlendFunc["ONE"] = 1] = "ONE";
    // Multiplies all colors by the source colors.
    BlendFunc[BlendFunc["SRC_COLOR"] = 768] = "SRC_COLOR";
    // Multiplies all colors by 1 minus each source color.
    BlendFunc[BlendFunc["ONE_MINUS_SRC_COLOR"] = 769] = "ONE_MINUS_SRC_COLOR";
    // Multiplies all colors by the destination color.
    BlendFunc[BlendFunc["DST_COLOR"] = 774] = "DST_COLOR";
    // Multiplies all colors by 1 minus each destination color.
    BlendFunc[BlendFunc["ONE_MINUS_DST_COLOR"] = 775] = "ONE_MINUS_DST_COLOR";
    // Multiplies all colors by the source alpha value.
    BlendFunc[BlendFunc["SRC_ALPHA"] = 770] = "SRC_ALPHA";
    // Multiplies all colors by 1 minus the source alpha value.
    BlendFunc[BlendFunc["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
    // Multiplies all colors by the destination alpha value.
    BlendFunc[BlendFunc["DST_ALPHA"] = 772] = "DST_ALPHA";
    // Multiplies all colors by 1 minus the destination alpha value.
    BlendFunc[BlendFunc["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
    // Multiplies all colors by a constant color.
    BlendFunc[BlendFunc["CONSTANT_COLOR"] = 32769] = "CONSTANT_COLOR";
    // Multiplies all colors by 1 minus a constant color.
    BlendFunc[BlendFunc["ONE_MINUS_CONSTANT_COLOR"] = 32770] = "ONE_MINUS_CONSTANT_COLOR";
    // Multiplies all colors by a constant alpha value.
    BlendFunc[BlendFunc["CONSTANT_ALPHA"] = 32771] = "CONSTANT_ALPHA";
    // Multiplies all colors by 1 minus a constant alpha value.
    BlendFunc[BlendFunc["ONE_MINUS_CONSTANT_ALPHA"] = 32772] = "ONE_MINUS_CONSTANT_ALPHA";
    // Multiplies the RGB colors by the smaller of either the source alpha value
    // or the value of 1 minus the destination alpha value.
    // The alpha value is multiplied by 1.
    BlendFunc[BlendFunc["SRC_ALPHA_SATURATE"] = 776] = "SRC_ALPHA_SATURATE";
})(BlendFunc || (BlendFunc = {}));
/// Draw modes for drawElements.
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements#mode
export var DrawMode;
(function (DrawMode) {
    /// Draws individual points.
    DrawMode[DrawMode["POINTS"] = 0] = "POINTS";
    /// Draws lines between pairs of vertices.
    DrawMode[DrawMode["LINES"] = 1] = "LINES";
    /// Draws a straight line to the next vertex, and connects the last vertex to the first.
    DrawMode[DrawMode["LINE_LOOP"] = 2] = "LINE_LOOP";
    /// Draws a straight line to the next vertex.
    DrawMode[DrawMode["LINE_STRIP"] = 3] = "LINE_STRIP";
    /// Draws triangles between triples of vertices (default).
    DrawMode[DrawMode["TRIANGLES"] = 4] = "TRIANGLES";
    /// Draws a triangle between the first vertex and the last two vertices.
    DrawMode[DrawMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
})(DrawMode || (DrawMode = {}));
// WebGL Constants ========================================================== //
/// WebGL2 Buffer Usage.
/// See: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData#usage
export var BufferUsage;
(function (BufferUsage) {
    // The contents of the buffer are likely to be used often and not change often.
    BufferUsage[BufferUsage["STATIC_DRAW"] = 35044] = "STATIC_DRAW";
    // The contents of the buffer are likely to not be used often.
    BufferUsage[BufferUsage["STREAM_DRAW"] = 35040] = "STREAM_DRAW";
    // The contents of the buffer are likely to be used often and change often.
    BufferUsage[BufferUsage["DYNAMIC_DRAW"] = 35048] = "DYNAMIC_DRAW";
    // The contents are intended to be specified once by reading data from WebGL, and queried many times by the application.
    BufferUsage[BufferUsage["STATIC_READ"] = 35045] = "STATIC_READ";
    // The contents are intended to be respecified repeatedly by reading data from WebGL, and queried many times by the application.
    BufferUsage[BufferUsage["DYNAMIC_READ"] = 35049] = "DYNAMIC_READ";
    // The contents are intended to be specified once by reading data from WebGL, and queried at most a few times by the application
    BufferUsage[BufferUsage["STREAM_READ"] = 35041] = "STREAM_READ";
    // The contents are intended to be specified once by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.
    BufferUsage[BufferUsage["STATIC_COPY"] = 35046] = "STATIC_COPY";
    // The contents are intended to be respecified repeatedly by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.
    BufferUsage[BufferUsage["DYNAMIC_COPY"] = 35050] = "DYNAMIC_COPY";
    // The contents are intended to be specified once by reading data from WebGL, and used at most a few times as the source for WebGL drawing and image specification commands.
    BufferUsage[BufferUsage["STREAM_COPY"] = 35042] = "STREAM_COPY";
})(BufferUsage || (BufferUsage = {}));
