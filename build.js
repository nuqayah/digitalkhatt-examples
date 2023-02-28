import fs from 'fs'
import postcss from 'postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import pseudo_is from 'postcss-pseudo-is'
import {minify} from 'terser'

const r = f => fs.readFileSync(f, 'utf8')
const min_js = async s => (await minify(s, {mangle: {toplevel: true}, toplevel: true, output: {comments: false}, compress: {global_defs: {'window.__DEBUG__': false}}})).code
const cssnano_conf = {preset: ['default', {normalizeUrl: false, discardComments: {removeAll: true}}]}
const min_css = async s => (await postcss([pseudo_is, autoprefixer, cssnano(cssnano_conf)]).process(s, {from: undefined})).css
const apply_repls = (s, repls) => repls.reduce((a, b) => a[b[2] ? 'replaceAll' : 'replace'](b[0], b[1]), s)

const polyfills = ['Object.fromEntries', 'Intl.RelativeTimeFormat.~locale.ar']
const pf_url = `document.write('<script src="https://polyfill.io/v3/polyfill.min.js?features=${polyfills.join(',')}"><\\/script>')`
const pf_script = `((${polyfills.map(pf => pf.replace(/\.~.*/, '')).join(' && ')}) || ${pf_url})`

// Service worker
fs.writeFileSync('dist/sw.js', await min_js(r('src/util/sw.js').replaceAll('$TS', Date.now())))

// Polyfills
const prod_script = await min_js(r('src/util/prod.js').replace('UA-KEY', 'UA-127500665-'))

// Gather assets
const [css, js] = await Promise.all([
    min_css(r('dist/bundle.css')),
    min_js(apply_repls(r('dist/bundle.js'), [
        ['/icons.svg#', '#icon-', 1],
    ])),
])

// Combine
const pg = apply_repls(r('index.html'), [
    [/>\n+ */g, '>'],
    [/<!-- styles -->/, () => `<style>${css}</style>`],
    [/<script src[\s\S]*<\/script>/, () => `<script>${pf_script};${prod_script}</script><script type=module>${js}</script>`],
])
const icon_repls = [[/ xmlns=".*?"/, ''], [/id="/g, 'id="icon-'], [/\n */g, ''], [/(\d")\//g, '$1 /'], [/="([^ ]+)"/g, '=$1']]
fs.writeFileSync('dist/index.html', pg + apply_repls(r('public/icons.svg'), icon_repls))
