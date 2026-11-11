
const CACHE_NAME = "fandomium-v1";

const APP_FILES = [
    "/",
    "/index.html",
    "/manifest.json",
    "/fav192.png",
    "/fav512.png",
    "/style.css",
    "/fandoms.html",
    "/characters.html",
    "/fandoms_script.js",
    "/characters_script.js",
    "/render.mjs",
    "/load.mjs",
    "/sort.mjs",
    "/search.mjs",
    "/fandoms.json",
    "/characters.json",
    "/about.html",
    "/quiz.html",
    "/quiz.js",
    "/quiz.css",

];

// Встановлення та початкове кешування
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

// Активація та очищення старих кешів
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) =>
                            key.startsWith("fandomium-") &&
                            key !== CACHE_NAME
                        )
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

// Обробка запитів
self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Тільки GET-запити з нашого домену
    if (
        request.method !== "GET" ||
        url.origin !== self.location.origin
    ) {
        return;
    }

    // Не кешуємо запити до API (можеш змінити)
    if (url.pathname.startsWith("/api/")) {
        return;
    }

    // HTML: Network First
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => cache.put(request, copy));
                    }

                    return response;
                })
                .catch(async () => {
                    return (
                        await caches.match(request) ||
                        await caches.match("/index.html") ||
                        Response.error()
                    );
                })
        );

        return;
    }

    // Статичні ресурси: Cache First
    event.respondWith(
        caches.match(request).then(async (cached) => {
            if (cached) return cached;

            try {
                const response = await fetch(request);

                if (response.ok && response.type === "basic") {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                }

                return response;
            } catch {
                return Response.error();
            }
        })
    );
});
