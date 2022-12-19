export class RocExitError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "RocExitError"
    }
}

export class FdWriteNotSupportedErrror extends Error {
    constructor(message: string) {
        super(message)
        this.name = "FdWriteNotSupportedError"
    }
}

export class RocPanicError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "RocPanicError"
    }
}

export class RocWasmInstanceStartError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "RocWasmInstanceStartError"
    }
}

export class FramebufferBoundsError extends Error {
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

export async function getRenderer(path: string): Promise<() => void> {
    const decoder = new TextDecoder()
    let exit_code: number
    let instance: WebAssembly.WebAssemblyInstantiatedSource

    const importObj = {
        wasi_snapshot_preview1: {
            proc_exit: (code: number) => {
                if (code !== 0) {
                    throw new RocExitError(`Exited with code ${code}`)
                }
                exit_code = code
            },
            fd_write: (x: unknown) => {
                throw new FdWriteNotSupportedErrror(
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
            js_render: (
                framebufferPointer: number,
                framebufferLength: number,
                width: number,
                height: number
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

                const buffer = (instance.instance.exports.memory as any)
                    .buffer as ArrayBuffer
                const framebuffer = new Uint8Array(buffer).subarray(
                    framebufferPointer,
                    framebufferPointer + framebufferLength
                )

                // for (let i = 0; i < width * height; i++) {
                //     if (bytes[i] !== 0) {
                //         console.log("Alert!")
                //     }
                // }

                console.log("Roc framebuffer: ", framebuffer)
                console.log(width)
                console.log(height)
            }
        }
    }

    instance = await getWasmInstance(path, importObj)

    return () => {
        try {
            ;(instance.instance.exports as any)._start()
        } catch (e: any) {
            const is_ok = e.message == "unreachable" && exit_code == 0

            if (!is_ok) {
                throw new RocWasmInstanceStartError(e)
            }
        }
    }
}
