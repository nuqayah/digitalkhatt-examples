<Header/>
<main>
  <Route path="/"><Home/></Route>
</main>
<Sidebar/>

<script>
import {Route, router} from 'tinro'
import Header from './Header.svelte'
import Sidebar from './sidebar/Sidebar.svelte'
import Home from './Home.svelte'
</script>
