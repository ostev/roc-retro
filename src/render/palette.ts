export type Palette = Uint32Array

export const paletteToVec4Array = (palette: Palette): number[] => {
    const vec4Array = []

    for (let i = 0; i < palette.length; i++) {
        const color = palette[i]

        vec4Array.push(
            (color & 0xff000000) >>> 24,
            (color & 0x00ff0000) >>> 16,
            (color & 0x0000ff00) >>> 8,
            (color & 0x000000ff) >>> 0
        )
    }

    return vec4Array
}

export const paletteToTextureData = (palette: Palette): Uint8Array => {
    const textureData = new Uint8Array(palette.length * 4)

    for (let i = 0; i < palette.length; i++) {
        const color = palette[i]

        textureData[i * 4 + 0] = (color & 0xff000000) >>> 24
        textureData[i * 4 + 1] = (color & 0x00ff0000) >>> 16
        textureData[i * 4 + 2] = (color & 0x0000ff00) >>> 8
        textureData[i * 4 + 3] = (color & 0x000000ff) >>> 0
    }

    return textureData
}

export const paletteSize = 16
