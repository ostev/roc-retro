import hostUrl from "./host?url"
import { RenderEngine } from "./render/engine"

export class WebGLNotSupportedError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "WebGLNotSupportedError"
    }
}
export class Engine {
    private host: Worker
    private gl: WebGLRenderingContext
    private renderEngine: RenderEngine

    constructor(canvasElement: HTMLCanvasElement) {
        {
            const maybeGl = canvasElement.getContext("webgl")

            if (maybeGl === null) {
                throw new WebGLNotSupportedError("WebGL is not supported")
            }

            this.gl = maybeGl
        }

        {
            this.renderEngine = new RenderEngine(this.gl)
        }

        {
            this.host = new Worker(hostUrl)
            this.host.onerror = (e) => {
                console.error(e)
            }
            this.host.onmessage = (msg) => {
                if (msg.data[0] === "render") {
                    const framebuffer = new Uint8Array(msg.data[1])
                    const palette = new Uint32Array(msg.data[4])
                    // console.log(
                    //     `Render requested of:`,
                    //     framebuffer,
                    //     "with palette",
                    //     palette
                    // )

                    requestAnimationFrame(() => {
                        this.renderEngine.render(framebuffer, palette, {
                            width: msg.data[2] as number,
                            height: msg.data[3] as number
                        })
                    })

                    // console.log("Rendered.")
                } else {
                    console.log(
                        "Engine received unknown message from host worker: ",
                        msg
                    )
                }
            }
        }
    }

    start = (wasmUrl: string) => {
        this.host.postMessage(["start", wasmUrl])
    }
}
