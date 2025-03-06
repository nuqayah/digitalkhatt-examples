<div class="text-center my-1 pb-1 text-2xl border-b-2">
<a href=/otf-mushaf>OTF Mushaf</a> • <a href=/wasm>Wasm</a>
</div>

<Route>
  <Route path=/otf-mushaf><OTFMushaf/></Route>
  <Route path=/wasm><Wasm/></Route>
</Route>

<script>
import {Route, router} from 'tinro'
import OTFMushaf from './OTFMushaf.svelte'
import Wasm from './Wasm.svelte'
router.mode.memory()
</script>
