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
export const fragmentShader = `
    precision mediump float;

    // Passed in from the vertex shader
    varying vec2 v_texcoord;
    uniform sampler2D u_framebuffer;

    uniform sampler2D u_palette;

    void main() {
        float color = texture2D(u_framebuffer, v_texcoord).r;

        gl_FragColor = texture2D(u_palette, vec2(color, 0));
    }
`
