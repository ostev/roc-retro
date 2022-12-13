import { Palette } from "./palette"

export type Framebuffer = Uint8Array

export function toRGBA(
    palette: Palette,
    framebuffer: Framebuffer
): Uint32Array {
    const rgba = new Uint32Array(framebuffer.length * 4)

    for (let i = 0; i < framebuffer.length; i++) {
        ;[framebuffer[i] & 0b11110000, framebuffer[i] << 4]
            .map((paletteIndex) =>
                paletteIndex !== 0 ? palette[paletteIndex] : 0
            )
            .forEach((color, j) => (rgba[i * 2 + j] = color))
    }

    return rgba
}
