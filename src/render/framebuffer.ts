import { Palette, paletteToTextureData } from "./palette"

export type Framebuffer = Uint8Array

export interface FramebufferDimensions {
    width: number
    height: number
    padding: {
        right: number
        bottom: number
    }
}

export function toRGBA(palette: Palette, framebuffer: Framebuffer): Uint8Array {
    const paletteData = paletteToTextureData(palette)

    const rgba = new Uint8Array(framebuffer.length * 8)
    // const firstPixel = (framebuffer[0] & 0xf0) >>> 4
    // console.log(`First pixel from framebuffer: ${firstPixel.toString(16)}`)
    // console.log(
    //     `Second pixel from framebuffer: ${(
    //         (framebuffer[0] & 0x0f) >>>
    //         0
    //     ).toString(16)}`
    // )

    // console.log(
    //     `First RGBA pixel: ${paletteData[firstPixel * 4]}, ${
    //         paletteData[firstPixel * 4 + 1]
    //     }, ${paletteData[firstPixel * 4 + 2]}, ${0xff}`
    // )

    // console.log(`sampled r: ${paletteData[(framebuffer[0] & 0xf0) * 4]}`)

    for (let i = 0; i < framebuffer.length; i++) {
        ;[(framebuffer[i] & 0xf0) >>> 4, (framebuffer[i] & 0x0f) >>> 0]
            .flatMap((paletteIndex) => [
                paletteData[paletteIndex],
                paletteData[paletteIndex + 1],
                paletteData[paletteIndex + 2],
                0xff
            ])
            .forEach((component, j) => {
                rgba[i * 8 + j] = component
            })
    }

    // console.log(rgba[0])

    return rgba
}
