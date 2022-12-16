import { retroInit } from "./host"
import { RenderEngine } from "./render/engine"
import { toRGBA } from "./render/framebuffer"
import {
    createPalette,
    paletteToTextureData,
    paletteToVec4Array
} from "./render/palette"

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

const framebuffer = new Uint8Array(256 * 256)
for (let i = 0; i < framebuffer.length; i++) {
    framebuffer[i] = 0x20
}
const palette = new Uint32Array([
    0x00000000, 0xffffffff, 0x00000000, 0x00000000
])
console.log(`Palette: ${palette}`)
console.log(`Palette as texture data: ${paletteToTextureData(palette)}`)
console.log(framebuffer)
console.log(toRGBA(palette, framebuffer))
console.log((framebuffer[0] & 0x0f) << 4)

const renderEngine = new RenderEngine(gl)
renderEngine.render(framebuffer, palette, {
    width: 256,
    height: 256,
    padding: {
        right: 0,
        bottom: 0
    }
})
