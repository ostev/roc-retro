import { Dimensions } from "./dimensions"
import { Framebuffer, FramebufferDimensions, toRGBA } from "./framebuffer"
import { Palette, paletteToTextureData, paletteSize } from "./palette"
import { fragmentShader, vertexShader } from "./shaders"
import {
    createProgramFromSources,
    createTexture,
    updateTexture
} from "./webglUtils"
import * as Matrix3 from "../math/matrix3"

export class RenderEngine {
    private gl: WebGLRenderingContext

    private framebufferTexture: WebGLTexture | undefined
    private shaderProgram: WebGLProgram

    // private paletteTexture: WebGLTexture | undefined
    // private previousPalette: Palette | undefined

    private updateMatrix: (dimensions: Dimensions) => void
    private updatePositions: (dimensions: Dimensions) => void

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl

        this.shaderProgram = createProgramFromSources(
            gl,
            vertexShader,
            fragmentShader
        )
        gl.useProgram(this.shaderProgram)

        const positionAttributeLocation = gl.getAttribLocation(
            this.shaderProgram,
            "a_position"
        )
        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(3), gl.STATIC_DRAW)
        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.vertexAttribPointer(
            positionAttributeLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )

        const framebufferLocation = gl.getUniformLocation(
            this.shaderProgram,
            "u_framebuffer"
        )
        this.gl.uniform1i(framebufferLocation, 0)

        const paletteLocation = gl.getUniformLocation(
            this.shaderProgram,
            "u_palette"
        )
        this.gl.uniform1i(paletteLocation, 1)

        const matrixLocation = gl.getUniformLocation(
            this.shaderProgram,
            "u_matrix"
        )

        this.updatePositions = (dimensions: Dimensions) => {
            // A rectangle
            const positions = new Float32Array([
                // Left triangle
                0,
                0,
                dimensions.width,
                0,
                0,
                dimensions.height,
                // Right triangle
                0,
                dimensions.height,
                dimensions.width,
                0,
                dimensions.width,
                dimensions.height
            ])

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
        }

        this.updateMatrix = (dimensions: Dimensions) => {
            const matrix = Matrix3.projection(
                dimensions.width,
                dimensions.height
            )

            gl.uniformMatrix3fv(matrixLocation, false, matrix)
        }
    }

    render = (
        framebuffer: Framebuffer,
        palette: Palette,
        dimensions: Dimensions
    ) => {
        const framebufferDimensions: FramebufferDimensions = {
            width: Math.ceil(dimensions.width / 2),
            height: Math.ceil(dimensions.height / 2),
            padding: {
                right: dimensions.width % 2,
                bottom: dimensions.height % 2
            }
        }

        const paddedDimensions: Dimensions = {
            width: framebufferDimensions.width * 2,
            height: framebufferDimensions.height * 2
        }

        const rgba = toRGBA(palette, framebuffer)

        this.gl.viewport(0, 0, dimensions.width, dimensions.height)

        this.gl.clearColor(1, 1, 1, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        this.gl.activeTexture(this.gl.TEXTURE0)
        if (this.framebufferTexture === undefined) {
            this.framebufferTexture = createTexture(
                this.gl,
                dimensions.width,
                dimensions.height,
                rgba,
                this.gl.RGBA,
                this.gl.RGBA
            )
        } else {
            updateTexture(
                this.gl,
                this.framebufferTexture,
                rgba,
                [dimensions.width, dimensions.height],
                this.gl.RGBA,
                this.gl.RGBA
            )
        }

        // this.gl.activeTexture(this.gl.TEXTURE1)
        // if (this.paletteTexture === undefined) {
        //     this.paletteTexture = createTexture(
        //         this.gl,
        //         paletteSize,
        //         1,
        //         paletteToTextureData(palette)
        //     )
        // } else if (palette !== this.previousPalette) {
        //     updateTexture(
        //         this.gl,
        //         this.paletteTexture,
        //         paletteToTextureData(palette),
        //         [paletteSize, 1]
        //     )
        // }

        this.updateMatrix(paddedDimensions)
        this.updatePositions(paddedDimensions)

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
}
