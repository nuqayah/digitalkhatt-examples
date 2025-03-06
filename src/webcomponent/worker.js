import {expose} from 'comlink'
import quranService from './quranservice.service.js'

self.document = {querySelectorAll(){return []}}

const state = {
    canceled: false,
    files_original: [],
}

let fn
let canvas
function set_canvas(canvas_) {
    canvas = canvas_
    return true
}
async function init() {
    fn = await quranService.promise
    return true
}
async function shapeText(...args) {
    // const args1 = Object.values(args)
    // const ret = fn(...args1, canvas.getContext('2d'))
    const ret = fn.shapeText(...args, canvas.getContext('2d'))
    console.log(ret)
    return ret
}
// async function fn(repls, on_result) {}
expose({state, init, set_canvas, shapeText})
