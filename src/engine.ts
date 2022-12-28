import hostUrl from "./host?url"
import { RenderEngine } from "./render/engine"
import { InputReader } from "./input"

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
    private inputBuffer: SharedArrayBuffer
    private inputReader: InputReader
    private frameDeltas: number[] = []

    constructor(canvasElement: HTMLCanvasElement, debugElement: HTMLElement) {
        this.inputBuffer = new SharedArrayBuffer(4)
        this.inputReader = new InputReader(new Uint32Array(this.inputBuffer))

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
                } else if (msg.data[0] === "frameDelta") {
                    const frameDelta = Number(msg.data[1])

                    if (this.frameDeltas.length >= 30) {
                        this.frameDeltas.shift()
                    }
                    this.frameDeltas.push(frameDelta)

                    /// The average frame delta of the past 30 frames
                    const averageFrameDelta =
                        this.frameDeltas.reduce((a, b) => a + b, 0) /
                        this.frameDeltas.length

                    /// The average FPS of the past 30 frames
                    const averageFPS = 1000 / averageFrameDelta

                    const fpsElement = debugElement.querySelector(".fps")

                    if (fpsElement !== null) {
                        fpsElement.textContent = averageFPS.toPrecision(4)
                    } else {
                        const newFPSElement = document.createElement("p")
                        newFPSElement.className = "fps"
                        debugElement.appendChild(newFPSElement)
                    }

                    const frameDeltaElement =
                        debugElement.querySelector(".frameDelta")

                    if (frameDeltaElement !== null) {
                        frameDeltaElement.textContent =
                            averageFrameDelta.toPrecision(3)
                    } else {
                        const newFrameDeltaElement = document.createElement("p")
                        newFrameDeltaElement.className = "frameDelta"
                        debugElement.appendChild(newFrameDeltaElement)
                    }
                } else {
                    console.warn(
                        "Engine received unknown message from host worker: ",
                        msg
                    )
                }
            }
        }
    }

    start = (wasmUrl: string) => {
        this.host.postMessage(["start", wasmUrl, this.inputBuffer])
    }
}
