import { paletteSize } from "./palette"

export const vertexShader = `
    attribute vec2 a_position;

    uniform mat3 u_matrix;

    varying vec2 v_texcoord;

    void main() {
        // Multiply the position by the matrix.
        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

        // Pass the texture coordinate to the fragment shader
        v_texcoord = gl_Position.xy;
    }
`

const paletteLookup = Array.from({ length: paletteSize })
    .map(
        (_, i) =>
            `
            if (color == (1.0 / 255.0) * ${i}.0) {
                ${
                    i === 10
                        ? `gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);`
                        : `gl_FragColor = vec4(u_palette[${i}], 1.0);`
                }
            }
            `
    )
    .join(" else ")

export const fragmentShader = `
    precision mediump float;

    // Passed in from the vertex shader
    varying vec2 v_texcoord;
    uniform sampler2D u_framebuffer;

    uniform vec3 u_palette[${paletteSize}];

    void main() {
        float color = texture2D(u_framebuffer, v_texcoord).r;

        ${paletteLookup}
        // gl_FragColor = vec4(color * 50.0, color * 50.0, 0.0, 1.0);

    }
`
