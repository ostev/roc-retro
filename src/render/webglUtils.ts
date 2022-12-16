class ShaderCompileError extends Error {
    name = "ShaderCompileError"
}

class ShaderCreationError extends Error {
    name = "ShaderCreationError"
}

export class TextureCreationError extends Error {
    name = "TextureCreationError"
}

export function createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
) {
    let shader = gl.createShader(type)

    if (shader === null) {
        throw new ShaderCreationError(
            `Shader with source ${source} failed to create`
        )
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (success) {
        return shader
    } else {
        const error = new ShaderCompileError(
            gl.getShaderInfoLog(shader) ||
                `Shader with source ${source} failed to compile or was non-existent`
        )
        gl.deleteShader(shader)
        throw error
    }
}

export class ProgramCreationError extends Error {
    name = "ProgramCreationError"
}

export class ProgramLinkingError extends Error {
    name = "ProgramLinkingError"
}

export function createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
): WebGLProgram {
    const program = gl.createProgram()

    if (program === null) {
        throw new ProgramCreationError("A program failed to create")
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)

    if (success) {
        return program
    } else {
        const error = new ProgramLinkingError(
            gl.getProgramInfoLog(program) || undefined
        )
        gl.deleteProgram(program)

        throw error
    }
}

const zip = <T>(rows: any) =>
    rows[0].map((_: any, c: any) => rows.map((row: any) => row[c]))

export function setupScene(
    gl: WebGLRenderingContext,
    attributeNames: string[],
    uniformNames: string[],
    geometry: number[],
    program: WebGLProgram,
    geometry2?: number[] | undefined
): {
    uniforms: Record<string, WebGLUniformLocation>
    attributes: Record<string, number>
    positionBuffer: WebGLBuffer | null
    geometry2Buffer: WebGLBuffer | null
} {
    gl.useProgram(program)

    const attributeLocations = attributeNames.map((name) =>
        gl.getAttribLocation(program, name)
    )

    const uniformLocations = uniformNames.map(
        (name) => gl.getUniformLocation(program, name) as WebGLUniformLocation
    )

    const positionBuffer = gl.createBuffer()
    // Basically telling WebGL that the array buffer is
    // `positionBuffer`
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Put the geometry in the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW)

    let geometry2Buffer
    if (geometry2 !== undefined && geometry2 !== null) {
        geometry2Buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, geometry2Buffer)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(geometry2),
            gl.STATIC_DRAW
        )
    }

    const attributes = Object.fromEntries(
        zip([attributeNames, attributeLocations])
    )

    const uniforms = Object.fromEntries(zip([uniformNames, uniformLocations]))

    return {
        attributes,
        uniforms,
        positionBuffer,
        geometry2Buffer: geometry2Buffer ?? null
    }
}

export function createProgramFromSources(
    gl: WebGLRenderingContext,
    vertex: string,
    fragment: string
) {
    return createProgram(
        gl,
        createShader(gl, gl.VERTEX_SHADER, vertex),
        createShader(gl, gl.FRAGMENT_SHADER, fragment)
    )
}

export function readPixel(gl: WebGLRenderingContext, x: number, y: number) {
    const buffer = new Uint8Array(4)

    gl.readPixels(x - 1, y - 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buffer)
    return [buffer[0], buffer[1], buffer[2], buffer[3]]
}

export function defaultTextureOptions(gl: WebGLRenderingContext) {
    return {
        level: 0,
        internalFormat: gl.RGBA,
        border: 0,
        format: gl.RGBA,
        type: gl.UNSIGNED_BYTE
    }
}

export function createTexture(
    gl: WebGLRenderingContext,
    width: number,
    height: number,
    data: ArrayBufferView | null,
    format: number = gl.RGBA,
    internalFormat: number = format,
    type: number = gl.UNSIGNED_BYTE
): WebGLTexture {
    const texture = gl.createTexture()

    if (texture === null) {
        throw new TextureCreationError(
            "Texture creation failure occurred — texture is null"
        )
    }

    gl.bindTexture(gl.TEXTURE_2D, texture)

    const { level, border } = defaultTextureOptions(gl)

    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        format,
        type,
        data
    )

    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    return texture
}

export function updateTexture(
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    data: ArrayBufferView,
    dimensions: [number, number],
    format: number = gl.RGBA,
    internalFormat: number = format,
    type: number = gl.UNSIGNED_BYTE
) {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    const { level, border } = defaultTextureOptions(gl)
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        dimensions[0],
        dimensions[1],
        border,
        format,
        type,
        data
    )
}
