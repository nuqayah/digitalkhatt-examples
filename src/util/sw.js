const clear_caches = cmp => caches.keys().then(keys => Promise.all(keys.filter(cmp).map(n => caches.delete(n))))
const cache_fresh = async (cache, url) => cache.put(url, await fetch(`${url}${url.includes('?') ? '&' : '?'}__nc=${Date.now()}`))
async function fetch_and_cache(request, cache_name) {
    const response = await fetch(request.clone())
    if (!response || response.status !== 200 || response.type !== 'basic')
        return response

    (await caches.open(cache_name)).put(request, response.clone())
    return response
}

const MANIFEST = {
    'app-v$TS': [
        './',
    ],
    media: [
        '/manifest.json',
        // '/favicon.png',
        // '/logo.png',
        '/app.png',
        'https://fonts.nuqayah.com/kitab-base.woff2?v4',
        'https://fonts.nuqayah.com/kitab-base-b.woff2?v4',
        'https://fonts.nuqayah.com/kitab-phrases.woff2?v4',
        'https://nuqayah.com/assets/nuqayah.svg',
        'https://nuqayah.com/assets/img/ayatt-logo.svg',
    ],
}

self.addEventListener('install', e => {
    e.waitUntil(Promise.all([
        clear_caches(n => !Object.keys(MANIFEST).includes(n)),
        caches.open('app-v$TS').then(cache => Promise.all(MANIFEST['app-v$TS'].map(url => cache_fresh(cache, url)))),
    ]))
    caches.open('media').then(cache => cache.addAll(MANIFEST.media))
    self.skipWaiting()
})
self.addEventListener('fetch', e => {
    let url = e.request.url.replace(location.origin, '')
    if (url === '/')
        url = './'
    for (const k of Object.keys(MANIFEST))
        if (MANIFEST[k].includes(url)) {
            e.respondWith(caches.match(url).then(r => r || fetch_and_cache(e.request, k)))
            return
        }
})
