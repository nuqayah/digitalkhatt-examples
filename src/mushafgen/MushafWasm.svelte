<div bind:this={cont_el} class=block {style}>
  <canvas bind:this={canvas} class=inline-block/>
</div>

<script>
export let text = 'إِنَّ ٱلَّذِينَ كَفَرُوا۟ سَوَآءٌ عَلَيْهِمْ ءَأَنذَرْتَهُمْ'
export let fontExpansion = !false
export let tajweed = true
export let just = true
export let quranShaper
export let style = 'width: 550px'

const LINE_HEIGHT = 2.8
const defaultSize = (1000 / 4600) * 52.0 // 15.65 pt = 20.869 px
const FACTOR = 20

let width
let height
let ctx
let cont_el
let canvas

onMount(async () => {
    ctx = canvas.getContext('2d')
    drawText()
})


function clearCanvas(ctx) {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    // Will always clear the right space
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
}

function drawText() {
    // debugger
    const computedStyle = window.getComputedStyle(cont_el)

    const fontSize = parseFloat(computedStyle.fontSize) //
    const scale = (fontSize / defaultSize) // take into account the 96/72 difference

    const displayStyle = computedStyle.display

    const autoWidth = displayStyle === 'inline' || !cont_el.style.width
    if (!autoWidth) {
        const qswidth = quranShaper.shapeText(text, 0, scale, false, false, false, ctx)
        width = qswidth * scale
    }
    else
        width = 400 || cont_el.offsetWidth

    height = fontSize * LINE_HEIGHT * FACTOR

    // cont_el.style.width = width + 'px'
    // cont_el.style.height = height + 'px'

    // const dir_prop = computedStyle.direction == 'rtl' ? 'Right' : 'Left'
    // canvas.style['margin' + dir_prop] = - defaultSize * scale + 'px'

    const outputScale = window.devicePixelRatio
    const canvasWidth = width + (2 * defaultSize * scale)
    canvas.style.width = canvasWidth + 'px'
    canvas.style.height = height + 'px'
    canvas.width = canvasWidth * outputScale
    canvas.height = height * outputScale

    const totalscale = outputScale * scale
    ctx.transform(totalscale, 0, 0, totalscale, canvas.width - (defaultSize * scale * outputScale), canvas.height * 2 / (3 * FACTOR))

    clearCanvas(ctx)

    const wd = autoWidth ? 0 : width / (scale)
    quranShaper.shapeText(text, wd, scale / 2.3, just, tajweed, fontExpansion, ctx)
}
</script>
