<h1>DigitalKhatt OTF Mushaf</h1>

<div class="flex justify-center">
<label>Tajweed <Toggle on:change={toggle_tajweed} value={use_tajweed}/></label>     <label>Variable font <Toggle bind:value={use_variable_font}/></label>
</div>

<main dir=rtl bind:this={cont} class:variable_font={use_variable_font} on:click={main_click}>
  {@html [...Array(604)].map((_, i) => i + 1).map(page => `<article data-page=${page}></article>`).join(' ')}
</main>

<Tooltip/>

<script>
import {apply_repls, add_zwj} from 'components/src/util.js'
import Toggle from 'components/src/ToggleSimple.svelte'
import Tooltip, {click_action as tip_action, options as tip_options} from 'components/src/Tooltip.svelte'

let cont
let use_variable_font = false
let use_tajweed = true
let observer
let quran

;(async function init() {
    quran = (await (await fetch('https://fonts.nuqayah.com/tanzil-pages.txt')).text()).split('\n')
    observer = new IntersectionObserver(handle_intersection, {root: cont, threshold: 0.5})
    ;[...cont.children].forEach(el => { observer.observe(el) })
    ;[0, 1, 2].forEach(i => {
        cont.children[i].dataset.loaded = true
        cont.children[i].innerHTML = page_tpl(i + 1)
    })
})()


function handle_intersection(entries) {
    entries.forEach(entry => {
        if (!entry.isIntersecting)
            return

        observer.unobserve(entry.target)
        ;[entry.target, entry.target.previousElementSibling, entry.target.nextElementSibling].forEach(el => {
            if (!el || el.dataset.loaded)
                return

            el.innerHTML = page_tpl(+el.dataset.page)
            el.dataset.loaded = true
        })
    })
}
function page_tpl(page) {
  let t = quran[page - 1].replace(/(سُورَةُ .*?\\n)/g, '<center>$1</center>').replaceAll('\\n', ' ')
  if (use_tajweed)
      t = add_zwj(apply_repls(t, tajweed_repls))
  return `${t}`
}

function toggle_tajweed(e) {
  console.log('changing')
    use_tajweed = e.target.checked
    ;[...cont.children].forEach(el => { if (el.dataset.loaded) el.innerHTML = page_tpl(+el.dataset.page) })
}

const tajweed_repls = [
    [/([او]ٓ)(.ّ)/g,                     '<.madd-lazim>$1</span>$2'],
    [/([لمصكعسقن]ٓ)/g,                  '<.madd-lazim>$1</span>'],
    [/(آ)(لْ)/g,                        '<.madd-lazim>$1</span>$2'],
    [/(ـ?[اويٰ]ٓ)([ـ ]?ى?[ٕٔءأإؤئ])/g,     '<.madd-wajib>$1</span>$2'],
    [/([\u06E5\u06E6]ٓ)/g,              '<.madd-wajib>$1</span> '],
    [/(َا|ِي|ُو)(?=...[۝\n])/g,           (m, m1) => `<.madd-aarid>${m1}</span>`],

    [/ٱل(.ّ)/g,                         'ٱ<.idgham>ل</span>$1'],
    [/([لّ?.])ل(.ّ)/g,                   '$1<.idgham>ل</span>$2'],
    [/([وايى]۟)/g,                      '<.idgham>$1</span>'],
    [/([ࣰًࣱٌࣲٍ]|ن)([اى]? )([ينمو])/g,        '<.idgham>$1</span>$2<.ikhfaa>$3</span>'],
    [/([ࣰࣱࣲ]|ن)(?=[اى]? [لر])/g,          '<.idgham>$1</span>'],

    [/([ࣰًࣱٌࣲٍ]|ن)(?= ?[صذثكجشقسدطزفتضظ])/g, '<.ikhfaa>$1</span>'],
    [/([ۭۢ])/g,                          '<.ikhfaa>$1</span>'],
    [/([نم]ّ[َ-ِ])/g,                     '<.ikhfaa>$1</span>'],
    [/م(?= [مب])/g,                    '<.ikhfaa>م</span>'],

    [/([قطبجد]ْ)/g,                     '<.qalqalah>$1</span>'],
    [/<\.(\w.*?)>/g,                   (m, m1) => `<span class="tajweed-tip ${m1}">`],
    [/ (?=\d+[ ]|\n)/,                 ' ۝'],
]


function main_click(e) {
    if (e.target.matches('span.tajweed-tip')) {
        tip_options.set({show: true, msg: tajweed_tips[e.target.classList[1]], attach_to: e.target, direction: 'top'})
        e.stopPropagation()
    }
}
const tajweed_tips = {
    'madd-lazim': 'مد لازم',
    'madd-wajib': 'مد واجب',
    'madd-aarid': 'مد عارض',
    idgham: 'إخفاء ومواقع الغنة',
    ikhfaa: 'إدغام وما لا يُلفظ',
    qalqalah: 'قلقلة',
}
</script>

<style>
@font-face {
  font-family: digitalkhatt;
  src: url(https://raw.githubusercontent.com/DigitalKhatt/madinafont/main/madina.woff2);
}
@font-face {
  font-family: digitalkhatt;
  src: url(https://raw.githubusercontent.com/DigitalKhatt/madinafont/main/madina.woff2);
  font-weight: bold;
}
@font-face {
  font-family: digitalkhatt_cff2;
  src: url(https://fonts.nuqayah.com/digitalkhatt-cff2.otf);
}
main {
  font-family: digitalkhatt;
  font-size: 1.2rem;
  max-width: min(475px, 95vw);
  line-height: 1.9;
  margin: 0 auto;
  max-height: 90vh;
  overflow: auto;
}
main.variable_font {
  font-family: digitalkhatt_cff2;
}
:global(article) {
  text-align: justify;
  margin: 1rem 0;
  border:  1px solid;
  border-radius: 2px;
  padding: 0.2rem 0.5rem;
  min-height: 400px;
}
label {display: flex; justify-content: center;}

:global {
    /* Tajweed Colors */
  .madd-lazim { color: #d70092; }
  .madd-wajib { color: #e72929; }
  .madd-aarid { color: orange; }
  /* .ikhfaa { color: green; font-weight: bold;} */
  .ikhfaa { color: green; }
  .idgham {color: rgba(169, 169, 169, 0.5);}
  .qalqalah { color: skyblue; }
  .tajweed-tip {
    cursor: pointer;
  }
}
h1 {
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
}

:global {
    .tip-arrow::before {
      /* border: none !important; */
    }
    .tooltip-inner {
      color: var(--tip-color) !important;
      background: #444 !important;
    }
    .tooltip-top .tip-arrow::before {
      top: 0;
      border-width: 0.4rem 0.4rem 0;
      border-top-color: #444 !important
}
}
</style>
