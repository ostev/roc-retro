import { Dimensions } from "./dimensions"
import { Framebuffer, toRGBA } from "./framebuffer"
import { Palette } from "./palette"
import { fragmentShader, vertexShader } from "./shaders"
import {
    createProgramFromSources,
    createTexture,
    updateTexture
} from "./webglUtils"

export const paletteSize = 16

export class RenderEngine {
    gl: WebGLRenderingContext
    framebufferTexture: WebGLTexture | undefined
    shaderProgram: WebGLProgram

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl

        this.shaderProgram = createProgramFromSources(
            gl,
            vertexShader,
            fragmentShader
        )

        // A square
        const positions = new Float32Array([
            -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0
        ])

        const positionAttributeLocation = gl.getAttribLocation(
            this.shaderProgram,
            "a_position"
        )
        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

        const texcoordAttributeLocation = gl.getAttribLocation(
            this.shaderProgram,
            "a_texcoord"
        )
        const texcoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    }

    render = (
        framebuffer: Framebuffer,
        palette: Palette,
        dimensions: Dimensions
    ) => {
        const rgba = toRGBA(palette, framebuffer)

        if (this.framebufferTexture === undefined) {
            this.framebufferTexture = createTexture(
                this.gl,
                dimensions.width,
                dimensions.height,
                rgba
            )
        } else {
            updateTexture(this.gl, this.framebufferTexture, rgba, [
                dimensions.width,
                dimensions.height
            ])
        }
    }
}
