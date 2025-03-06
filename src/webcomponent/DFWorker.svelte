<div bind:this={cont_el} class=block>
  <canvas bind:this={canvas} class=inline-block/>
</div>
<canvas bind:this={canvas1}></canvas>

<script>
export let text = 'إِنَّ ٱلَّذِينَ كَفَرُوا۟ سَوَآءٌ عَلَيْهِمْ ءَأَنذَرْتَهُمْ'
export let fontExpansion = false
export let tajweed = true
export let just = true
export let quranShaper
import {transfer} from 'comlink'

const LINE_HEIGHT = 1.8
let defaultSize = (1000 / 4600) * 72.0 // 15.65 pt = 20.869 px

let width
let height
let ctx
let cont_el
let canvas
let canvas1

onMount(async () => {
    ctx = canvas.getContext('2d')

    const outputScale = window.devicePixelRatio
    const computedStyle = window.getComputedStyle(cont_el)

    const fontSize = parseFloat(computedStyle.fontSize)
    const displayStyle = computedStyle.display
    const offscreen = canvas1.transferControlToOffscreen()
    await quranShaper.set_canvas(transfer(offscreen, [offscreen]))
    // canvas1.transferControlToOffscreen()
    drawText(outputScale, computedStyle, fontSize, displayStyle)
})


function clearCanvas(ctx) {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    // Will always clear the right space
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
}

function drawText(outputScale, computedStyle, fontSize, displayStyle) {
    const scale = fontSize / defaultSize // take into account the 96/72 difference

    let autoWidth = displayStyle === "inline" || !cont_el.style.width

    if (autoWidth) {
        const qswidth = quranShaper.shapeText(text, 0, scale, false, false, false)
        width = qswidth * scale
    }
    else
        width = cont_el.offsetWidth

    height = fontSize * LINE_HEIGHT

    cont_el.style.width = width + "px"
    cont_el.style.height = height + "px"

    const canvasWidth = width + (2 * defaultSize * scale)

    // canvas.transferControlToOffscreen()
    canvas.style.width = canvasWidth + "px"
    const dir_prop = computedStyle.direction == 'rtl' ? 'Right' : 'Left'
    canvas.style['margin' + dir_prop] = - defaultSize * scale + "px"
    canvas.style.height = height + "px"

    canvas.width = canvasWidth * outputScale
    canvas.height = height * outputScale

    const totalscale = outputScale * scale
    ctx.transform(totalscale, 0, 0, totalscale, canvas.width - (defaultSize * scale * outputScale), canvas.height * 2 / 3)

    clearCanvas(ctx)

    const wd = autoWidth ? 0 : width / scale
    quranShaper.shapeText(text, wd, scale, just, tajweed, fontExpansion)
}
</script>
