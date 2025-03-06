<div class="text-center my-1 pb-1 text-2xl border-b-2">
<a href=/otf-mushaf>OTF Mushaf</a> • <a href=/wasm>Wasm</a> • <a href=/mushaf-gen>MushafGen</a>
</div>

<Route>
  <Route path=/otf-mushaf><OTFMushaf/></Route>
  <Route path=/wasm><Wasm/></Route>
  <Route path=/mushaf-gen><MushafGen/></Route>
</Route>

<script>
import {Route, router} from 'tinro'
import OTFMushaf from './OTFMushaf.svelte'
import Wasm from './Wasm.svelte'
import MushafGen from './mushafgen/MushafGen.svelte'
router.mode.memory()
router.goto('/otf-mushaf')
</script>
