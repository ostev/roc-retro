import serviceWorkerUrl from "./serviceWorker?url"

export const installWorker = () => {
    if ("serviceWorker" in navigator) {
        // Register service worker
        return navigator.serviceWorker.register(serviceWorkerUrl).then(
            function (registration) {
                console.log(
                    "COOP/COEP Service Worker registered",
                    registration.scope
                )
                // If the registration is active, but it's not controlling the page
                if (
                    registration.active &&
                    !navigator.serviceWorker.controller
                ) {
                    window.location.reload()
                }
            },
            function (err) {
                console.log("COOP/COEP Service Worker failed to register", err)
            }
        )
    } else {
        console.warn("Cannot register a service worker")
        return Promise.reject()
    }
}

export const installWorkerIfCOIHeadersNotSet = async () => {
    try {
        new SharedArrayBuffer(2)
    } catch (error) {
        console.log(
            "Correct COI HTTP headers not set, installing service worker..."
        )
        await installWorker()
    }
}
