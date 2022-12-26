let instance: WebAssembly.WebAssemblyInstantiatedSource
let inputBuffer: SharedArrayBuffer

class InputBufferNotProvidedError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "InputBufferNotProvidedError"
    }
}

self.onmessage = (
    msg: MessageEvent<[string, string, SharedArrayBuffer | undefined]>
) => {
    if (msg.data[0] === "start") {
        let [command, wasmUrl, inputBufferFromMainThread] = msg.data

        if (inputBufferFromMainThread === undefined) {
            throw new InputBufferNotProvidedError("Input buffer not provided")
        }
        inputBuffer = inputBufferFromMainThread

        console.log("Host worker starting Roc runtime...")
        ;(async () => await start(wasmUrl))()
    } else {
        console.log("Host worker received unknown message:", msg)
    }
}

class RocExitError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "RocExitError"
    }
}

class FdWriteNotSupportedError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "FdWriteNotSupportedError"
    }
}

class RocPanicError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "RocPanicError"
    }
}

class RocWasmInstanceStartError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "RocWasmInstanceStartError"
    }
}

class FramebufferBoundsError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "FramebufferBoundsError"
    }
}

function getWasmInstance(
    path: string,
    importObj: WebAssembly.Imports
): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
    if (WebAssembly.instantiateStreaming) {
        // Streaming API allows browser to begin compiling the module while it
        // is downloading it.
        return WebAssembly.instantiateStreaming(fetch(path), importObj)
    } else {
        // Fall back to the old API
        return fetch(path)
            .then((response) => response.arrayBuffer())
            .then((bytes) => WebAssembly.instantiate(bytes, importObj))
    }
}

async function start(path: string) {
    let exit_code: number | undefined = undefined
    console.log("Starting...")

    const importObj = {
        wasi_snapshot_preview1: {
            proc_exit: (code: number) => {
                if (code !== 0) {
                    throw new RocExitError(`Exited with code ${code}`)
                }
                exit_code = code
            },
            fd_write: (x: unknown) => {
                throw new FdWriteNotSupportedError(
                    `fd_write not supported: ${x}`
                )
            }
        },
        env: {
            roc_panic: (_pointer: unknown, _tag_id: unknown) => {
                throw new RocPanicError(
                    `Remain calm! Do not panic! Roc panicked!`
                )
            },
            js_get_time: () => performance.now(),
            js_log: (msg: number) => console.log(msg),
            js_read_input: () => 0,
            js_render: (
                framebufferPointer: number,
                framebufferLength: number,
                width: number,
                height: number,
                palettePointer: number
            ) => {
                if (framebufferLength !== width * height) {
                    if (framebufferLength > width * height) {
                        throw new FramebufferBoundsError(
                            `Frame buffer length (${framebufferLength}) is greater than its width and height dictates: ${width} * ${height} = ${
                                width * height
                            }.`
                        )
                    } else {
                        throw new FramebufferBoundsError(
                            `Frame buffer length (${framebufferLength}) is less than its width and height dictates: ${width} * ${height} = ${
                                width * height
                            }.`
                        )
                    }
                }

                const memoryBuffer = (instance.instance.exports.memory as any)
                    .buffer as ArrayBuffer

                const palette = memoryBuffer.slice(
                    palettePointer,
                    palettePointer + 16 * 4
                )
                const framebuffer = memoryBuffer.slice(
                    framebufferPointer,
                    framebufferPointer + framebufferLength
                )

                // for (let i = 0; i < width * height; i++) {
                //     if (bytes[i] !== 0) {
                //         console.log("Alert!")
                //     }
                // }

                // console.log("Roc framebuffer:", framebuffer)
                // console.log("Roc palette:", palette)

                self.postMessage([
                    "render",
                    framebuffer,
                    width,
                    height,
                    palette
                ])
            }
        }
    }

    instance = await getWasmInstance(path, importObj)
    console.log("Have instance")

    try {
        ;(instance.instance.exports as any)._start()
    } catch (e: any) {
        const is_ok = e.message == "unreachable" && exit_code == 0

        if (!is_ok) {
            throw new RocWasmInstanceStartError(e)
        }
    }
}
