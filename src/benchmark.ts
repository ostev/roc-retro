export function benchmark<T>(f: () => T) {
    const startTime = performance.now()
    f()
    const endTime = performance.now()
    return endTime - startTime
}
