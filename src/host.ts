export interface RetroModule {
    rocInstance: WebAssembly.Instance

}

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

function getWasmModule(path: string, importObj: WebAssembly.Imports): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
    if (WebAssembly.instantiateStreaming) {
        // Streaming API allows browser to begin compiling the module while it
        // is downloading it.
        return WebAssembly.instantiateStreaming(fetch(path), importObj)
    } else {
        // Fall back to the old API
        return fetch(path)
            .then(response => response.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, importObj))
    }
}

export async function retroInit(path: string): Promise<RetroModule> {
    const decoder = new TextDecoder()
    let memory_bytes: any;
    let exit_code;

    function displayRocString(str_bytes, str_len) {
        const utf8_bytes = memory_bytes.subarray(str_bytes, str_bytes + str_len);
        const js_string = decoder.decode(utf8_bytes);
        console.log(js_string);
    }

    const importObj = {
        wasi_snapshot_preview1: {
            proc_exit: (code: number) => {
                if (code !== 0) {
                    throw new RocExitError(`Exited with code ${code}`)
                }
                exit_code = code
            },
            fd_write: (x: unknown) => {
                throw new FdWriteNotSupportedErrror(`fd_write not supported: ${x}`)
            }
        },
        env: {
            roc_panic: (_pointer: unknown, _tag_id: unknown) => {
                throw new RocPanicError(`Remain calm! Do not panic! Roc panicked!`)
            },
            js_display_roc_string: displayRocString
        }
    }

    const module = await getWasmModule(path, importObj)

    memory_bytes = new Uint8Array((module.instance.exports.memory as any).buffer)

    try {
        (module.instance.exports as any)._start();
    } catch (e: any) {
        const is_ok = e.message == "unreachable" && exit_code == 0

        if (!is_ok) {
            throw new RocWasmInstanceStartError(e)
        }
    }

    return {
        rocInstance: module.instance
    }
}