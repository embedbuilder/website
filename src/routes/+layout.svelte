<script lang="ts">
	import '@fontsource-variable/inter';
	import 'animate.css/animate.min.css';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt Event fired');
		});
	});
</script>

<slot />
