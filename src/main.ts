import { getRenderer } from "./host"
import { RenderEngine } from "./render/engine"
// import { toRGBA } from "./render/framebuffer"
import {
    createPalette,
    floatLookup,
    paletteToTextureData,
    paletteToVec3Array
} from "./render/palette"
import { benchmark } from "./benchmark"

const rocRender = await getRenderer("/game.wasm")
rocRender()

class WebGLNotSupportedError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "WebGLNotSupportedError"
    }
}

// Draw a basic scene
const canvas = document.createElement("canvas")
canvas.id = "display"
canvas.width = 256
canvas.height = 256
document.body.appendChild(canvas)

const gl = canvas.getContext("webgl")
if (gl === null) {
    throw new WebGLNotSupportedError("WebGL is not supported")
}

gl.getExtension("OES_texture_float")

const framebuffer = new Uint8Array((256 * 256) / 2)
for (let i = 0; i < framebuffer.length; i++) {
    framebuffer[i] = 0x33
}
const palette = new Uint32Array([
    0x00ffff00, 0xff005f00, 0xffffff00, 0xff000000, 0x00ff0f00, 0x5f209000,
    0x00000000, 0x00000000
])
console.log("Palette: ", palette)
console.log("Palette as texture data: ", paletteToTextureData(palette))
console.log("Palette as vec3 array ", paletteToVec3Array(palette))
console.log("Nibble framebuffer: ", framebuffer)
// console.log(toRGBA(palette, framebuffer))
console.log((framebuffer[0] & 0x0f) << 4)

// console.log(
//     `toRGBA execution time: ${benchmark(() => toRGBA(palette, framebuffer))}`
// )

// console.log("Byte framebuffer: ", byteFramebuffer)

const floatFramebuffer = new Float32Array(256 * 256)
floatFramebuffer.forEach((float, i) => {
    floatFramebuffer[i] = 1
})

console.log("Float framebuffer: ", floatFramebuffer)
console.log("Float lookup table: ", floatLookup)

const renderEngine = new RenderEngine(gl)

let renderTime = 0

const render = () => {
    renderTime = benchmark(() => {
        // const framebufferDimensions = {
        //     width: Math.ceil(window.innerWidth / 2),
        //     height: Math.ceil(window.innerHeight / 2)
        // }
        // console.log(framebufferDimensions)
        const canvasSize = window.innerWidth / 2
        canvas.setAttribute(
            "style",
            `
            display: block;
            width: ${canvasSize}px;
            height: ${canvasSize}px;
            margin: 0px;
            padding: 0px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            `
        )

        const byteFramebuffer = new Uint8Array(256 * 256)
        byteFramebuffer.forEach((_, i) => {
            if (i % 256 < 128) {
                byteFramebuffer[i] = 1
            } else {
                byteFramebuffer[i] = 0
            }
        })
        // byteFramebuffer[0] = 1
        renderEngine.render(byteFramebuffer, palette, {
            width: 256,
            height: 256
        })
    })
    requestAnimationFrame(render)
}

setInterval(() => console.log(renderTime), 10000)

render()
