import { retroInit } from "./host"
import { RenderEngine } from "./render/engine"
// import { toRGBA } from "./render/framebuffer"
import {
    createPalette,
    floatLookup,
    paletteToTextureData,
    paletteToVec3Array
} from "./render/palette"
import { benchmark } from "./benchmark"

await retroInit("/game.wasm")

class WebGLNotSupportedError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "WebGLNotSupportedError"
    }
}

// Draw a basic scene
const canvas = document.createElement("canvas")
canvas.width = 256
canvas.height = 256
canvas.setAttribute(
    "style",
    "position: absolute; top: 0; left: 0; width: 256px; height: 256px;"
)
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
    0x00ffff00, 0xff005f00, 0xffffff00, 0xff000000, 0x00ff0f00, 0x00000000,
    0x00000000, 0x00000000
])
console.log(`Palette: ${palette}`)
console.log(`Palette as texture data: ${paletteToTextureData(palette)}`)
console.log(`Palette as vec3 array ${paletteToVec3Array(palette)}`)
console.log(framebuffer)
// console.log(toRGBA(palette, framebuffer))
console.log((framebuffer[0] & 0x0f) << 4)

// console.log(
//     `toRGBA execution time: ${benchmark(() => toRGBA(palette, framebuffer))}`
// )

const byteFramebuffer = new Uint8Array(256 * 256)
byteFramebuffer.forEach((byte, i) => {
    byteFramebuffer[i] = 0x01
})

console.log(byteFramebuffer)

const floatFramebuffer = new Float32Array(256 * 256)
floatFramebuffer.forEach((float, i) => {
    floatFramebuffer[i] = 1
})

console.log(floatFramebuffer)

console.log("Float lookup table: ", floatLookup)

const renderEngine = new RenderEngine(gl)

let renderTime = 0

const render = () => {
    renderTime = benchmark(() =>
        renderEngine.render(byteFramebuffer, palette, {
            width: 256,
            height: 256
        })
    )
    requestAnimationFrame(render)
}

setInterval(() => console.log(renderTime), 10000)

render()
