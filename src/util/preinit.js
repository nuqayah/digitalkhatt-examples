window.BASE_TITLE = document.title
document.dir = 'rtl'
// document.dir = window.APP_LANG === 'ar' ? 'rtl' : 'ltr'
// document.documentElement.lang = window.APP_LANG

if (!window.__DEBUG__) {
    // Check localStorage + indexedDB
    try {
        localStorage.setItem('_TEST_KEY_', 1)
        localStorage.removeItem('_TEST_KEY_')
    } catch (e) {
        delete window['localStorage']
        localStorage = {setItem: () => {}, getItem: () => {}, removeItem: () => {}}
    }
    indexedDB.open('_TEST_DB_', 1).onerror = () => {
        alert('لم نتمكن من فتح قاعدة البيانات! عذرا، لن يعمل التطبيق.')
        window.__debug('Failed to open DB')
    }

    // Error logging
    window.ERROR_COUNT = 0
    function post_error(parts) {
        parts = [decodeURI(location) + ' - ' + window.__BUILD_HASH__, ...parts, navigator.userAgent]
        const body = JSON.stringify({err: parts.join('\n'), site: location.host})
        fetch('https://tafsir.app/err.php', {method: 'post', mode: 'no-cors', body})
    }
    window.onerror = (msg, url, ln, col, err) => {
        if (window.ERROR_COUNT++ > 50)
            return
        const loc = [(url || '').replace('https://', ''), ln || '', col || ''].join(':')
        post_error([msg, loc, err ? err.stack : '<no stack>'])
    }
    window.onunhandledrejection = e => {
        if (window.ERROR_COUNT++ > 50 || !(e && e.reason && e.reason.stack) || e.reason.stack.includes('TypeError: Failed to fetch'))
            return
        post_error(['(PROMISE) - ' + e.reason.stack])
    }
}

// User agent
{
    const UA = navigator.userAgent
    const doc_classes = document.documentElement.classList
    window._useragent = {
        ios: /iPad|iPhone|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
        safari: /^((?!chrome|android).)*safari/i.test(UA),
        pwa: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone,
        is_touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
    }
    if (window._useragent.safari)
        doc_classes.add('safari')

    if (window._useragent.ios)
        doc_classes.add('ios')

    if (UA.includes('Firefox'))
        doc_classes.add('firefox')

    if (/Windows NT|Intel Mac OS X/.test(UA))
        doc_classes.add('non-mobile')
    else if (/Android.*Chrome\//.test(UA))
        doc_classes.add('chrome-android')
}

window.addEventListener('keydown', function check_tab(e) {
    if (e.key === 'Tab') {
        document.documentElement.classList.add('user-is-tabbing')
        window.removeEventListener('keydown', check_tab)
    }
})

/* On mobile: 100vh != 100% */
{
    const div = document.createElement('div')
    div.style = 'position: absolute; height: 100vh'
    document.body.appendChild(div)
    window._VH_OFFSET = div.clientHeight - window.innerHeight
    // document.documentElement.style.setProperty('--vh-offset', `${window._VH_OFFSET}px`)
    div.remove()
}

if (!('at' in Array.prototype)) {
    const ops = {
        value(n) {
            n = Math.trunc(n) || 0
            if (n < 0)
                n += this.length
            if (n < 0 || n >= this.length)
                return undefined
            return this[n]
        },
        writable: true, enumerable: false, configurable: true,
    }
    for (const C of [Array, String])
        Object.defineProperty(C.prototype, 'at', ops)
}
