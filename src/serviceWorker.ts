self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", () => self.clients.claim())

self.addEventListener("fetch", (rawEvent) => {
    const event = rawEvent as any
    if (
        event.request.cache === "only-if-cached" &&
        event.request.mode !== "same-origin"
    ) {
        return
    }

    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                // It seems like we only need to set the headers for index.html
                // If you want to be on the safe side, comment this out
                // if (!response.url.includes("index.html")) return response;

                const newHeaders = new Headers(response.headers)
                newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp")
                newHeaders.set("Cross-Origin-Opener-Policy", "same-origin")

                const moddedResponse = new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                })

                return moddedResponse
            })
            .catch(function (e) {
                console.error(e)
            })
    )
})
