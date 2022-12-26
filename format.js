import * as Path from "path"
import { fileURLToPath } from "url"
import { existsSync, readdirSync, lstatSync } from "fs"
import { spawnSync } from "child_process"

/**
 * Retrieves the files ending with the given extension in
 * the given directory and its subdirectories.
 */
const getFiles = (dir, ext) => {
    let files = []
    if (existsSync(dir)) {
        readdirSync(dir).forEach((file) => {
            const path = Path.join(dir, file)
            if (lstatSync(path).isDirectory()) {
                files = files.concat(getFiles(path, ext))
            } else if (file.endsWith(ext)) {
                files.push(path)
            }
        })
    }
    console.log(files)
    return files
}

/**
 * Run `roc/target/release/roc format` to format
 * all files given as arguments.
 */
const rocFormat = (files) => {
    const dirname = Path.dirname(fileURLToPath(import.meta.url))
    const roc = Path.join(dirname, "roc/target/release/roc")
    const args = ["format", ...files]
    const options = { stdio: "inherit", stdout: "inherit", stderr: "inherit" }
    spawnSync(roc, args, options)
}

rocFormat(getFiles("roc_src", ".roc"))
rocFormat(getFiles("platform", ".roc"))
