import { Dimensions } from "./dimensions"
import { Framebuffer, FramebufferDimensions } from "./framebuffer"
import {
    Palette,
    paletteToTextureData,
    paletteSize,
    paletteToVec3Array
} from "./palette"
import { fragmentShader, vertexShader } from "./shaders"
import {
    createProgramFromSources,
    createTexture,
    updateTexture
} from "./webglUtils"
import * as Matrix3 from "../math/matrix3"

const framebufferScalingFactor = 2

export class RenderEngine {
    private gl: WebGLRenderingContext

    private framebufferTexture: WebGLTexture | undefined
    private shaderProgram: WebGLProgram

    // private paletteTexture: WebGLTexture | undefined
    // private previousPalette: Palette | undefined

    private updateMatrix: (dimensions: Dimensions) => void
    private updatePositions: (dimensions: Dimensions) => void

    private updatePalette: (palette: Palette) => void

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl

        this.shaderProgram = createProgramFromSources(
            gl,
            vertexShader,
            fragmentShader
        )
        gl.useProgram(this.shaderProgram)

        // Set texture alignment to 1 so we can have textures
        // with arbitrary dimensions
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)

        const positionAttributeLocation = gl.getAttribLocation(
            this.shaderProgram,
            "a_position"
        )
        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(6), gl.DYNAMIC_DRAW)
        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.vertexAttribPointer(
            positionAttributeLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )

        const texcoordAttributeLocation = gl.getAttribLocation(
            this.shaderProgram,
            "a_texcoord"
        )
        const texcoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(6), gl.STATIC_DRAW)
        gl.enableVertexAttribArray(texcoordAttributeLocation)
        gl.vertexAttribPointer(
            texcoordAttributeLocation,
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

        const matrixLocation = gl.getUniformLocation(
            this.shaderProgram,
            "u_matrix"
        )

        this.updatePalette = (palette) => {
            this.gl.uniform3fv(paletteLocation, paletteToVec3Array(palette))
        }

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

            const texCoords = new Float32Array([
                // Left triangle
                0, 0, 1, 0, 0, 1,
                // Right triangle
                0, 1, 1, 0, 1, 1
            ])

            gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.DYNAMIC_DRAW)
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
        // const dimensions = {
        //     width: Math.ceil(
        //         displayDimensions.width / framebufferScalingFactor
        //     ),
        //     height: Math.ceil(
        //         displayDimensions.height / framebufferScalingFactor
        //     )
        // }

        this.gl.viewport(0, 0, dimensions.width, dimensions.height)

        this.gl.clearColor(1, 1, 1, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        this.gl.activeTexture(this.gl.TEXTURE0)
        if (this.framebufferTexture === undefined) {
            this.framebufferTexture = createTexture(
                this.gl,
                dimensions.width,
                dimensions.height,
                framebuffer,
                this.gl.LUMINANCE,
                this.gl.LUMINANCE
                // this.gl.FLOAT
            )
        } else {
            updateTexture(
                this.gl,
                this.framebufferTexture,
                framebuffer,
                [dimensions.width, dimensions.height],
                this.gl.LUMINANCE,
                this.gl.LUMINANCE
                // this.gl.FLOAT
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

        this.updatePalette(palette)

        this.updateMatrix(dimensions)
        this.updatePositions(dimensions)

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
}
