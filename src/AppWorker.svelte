{#if quranShaper}
  <div style="direction:rtl; max-width: 400px; margin: auto;padding-top:100px;">
<Df {quranShaper} text="إِنَّ ٱلَّذِينَ كَفَرُوا۟ سَوَآءٌ عَلَيْهِمْ ءَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ خَتَمَ ٱللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰٓ أَبْصَٰرِهِمْ غِشَٰوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ"/>
  </div>
{/if}

<script>
import Df from './webcomponent/DF.svelte'
import {wrap, proxy} from 'comlink'

let quranShaper

const worker_ = new Worker(new URL('./webcomponent/worker.js', import.meta.url), {type: 'module'})
const worker = wrap(worker_)
;(async () => {
    // console.log(await worker.shapeText())
    // quranShaper = await worker.shapeText()
    await worker.init()
    quranShaper = worker
    console.log(quranShaper)
})()

// worker.fn().then(f => console.log(f))
// console.log()
onDestroy(() => {
    // worker_.terminate()
})
</script>
