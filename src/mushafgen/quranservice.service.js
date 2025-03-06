import VisualMetafontModule from "./VisualMetaFontWasm.js"

class QuranService {
    module
    quranShaper
    promise
    error
    files = ['ayah.mp', 'mfplain.mp', 'mpguifont.mp', 'myfontbase.mp', 'digitalkhatt.mp', 'parameters.json', 'automedina.fea']

    constructor() {
        this.promise = this.instantiateWasm("/dk/VisualMetaFontWasm.wasm")
        this.promise.then(result => {
            //console.log(result)
        })
        .catch(error => {
            console.error(error)
        })
    }

    async instantiateWasm(url) {
        let compPromise
        if (typeof WebAssembly.compileStreaming !== "undefined") {
            this.setStatus(null, "Fetching/Compiling")
            compPromise = WebAssembly.compileStreaming(fetch(url))
        } else {
            this.setStatus(null, "Fetching")
            const response = await fetch(url)

            if (response.ok) {
                compPromise = response.arrayBuffer().then((buffer) => {
                    this.setStatus(null, "Compiling")
                    return WebAssembly.compile(buffer)
                })
            } else {
                const error = new Error(response.statusText)
                this.setStatus(error, "Error during fetching WebAssembly.")
                return Promise.reject(error)
            }
        }

        return compPromise.then((module) => {
            return this.initilizeModule(module)
        })
    }

    initilizeModule(wasmModule) {
        this.module = {
            instantiateWasm: (imports, successCallback) => {
                WebAssembly.instantiate(wasmModule, imports).then((instance) => {
                    successCallback(instance, wasmModule)
                }, (error) => {
                    this.error = error
                    this.setStatus(error, "Error during instantiation")
                    console.log("Error during instantiation ", error)
                })
                return {}
            },
            preRun: [
                () => {
                    this.files.forEach(file => {
                        this.module.FS.createPreloadedFile(".", file, '/dk/' + file, true, false)
                    })
                }
            ],
            onRuntimeInitialized: () => {
                const result = new this.module.QuranShaper()

                if (result) {
                    this.quranShaper = result
                    this.files.forEach(file => {
                        this.module.FS.unlink(file)
                    })
                } else {
                    throw Error("Cannot initialize Visual metafont library")
                }
            },
            postRun: [],
            noInitialRun: true,
            wasmMemory: new WebAssembly.Memory({initial: 310, maximum: 6400}),
        }

        return VisualMetafontModule(this.module).then(() => {
            console.log("Webassembly compiled and instantiated")
            return this.quranShaper
        }).catch((error) => {
            this.setStatus(error, "Error during WebAssembly instantiation.")
            throw error
        })
    }

    setStatus(error, message) {
        console.log(message)
    }
}

export default new QuranService()
