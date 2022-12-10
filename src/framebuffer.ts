export type Framebuffer = Uint8Array;

export function toRGBA(palette: Uint8Array, framebuffer: Framebuffer): Uint8Array {
    const rgba = new Uint8Array(framebuffer.length * 2)

    for (let i = 0; i < framebuffer.length; i++) {
        [framebuffer[i] & 0b11110000, framebuffer[i] << 4]
            .map(paletteIndex => paletteIndex !== 0 ? palette[paletteIndex] : 0)
            .forEach((color, j) => rgba[i * 2 + j] = color)
    }

    return rgba
}