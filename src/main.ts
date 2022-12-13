import { retroInit } from "./host"
import { RenderEngine } from "./render/engine"
import { paletteToVec4Array } from "./render/palette"

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
    if (i % 256 < 128) {
        framebuffer[i] = 0x10
    } else {
        framebuffer[i] = 0x20
    }
}
const palette = new Uint32Array(16)
palette[0] = 0xff0000ff
palette[1] = 0x00ff00ff
palette[2] = 0x0000ffff
palette[3] = 0xffffffff

const renderEngine = new RenderEngine(gl)
renderEngine.render(framebuffer, palette, {
    width: 256,
    height: 256,
    padding: {
        right: 0,
        bottom: 0
    }
})
