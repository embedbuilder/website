<script>
	import dissmissableContents from '$lib/stores/dissmissableContents';
	import { faBullhorn, faXmark } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { scale } from 'svelte/transition';

	$: dismissed = $dissmissableContents?.discordBanner ?? false;

	let show = false;
	setTimeout(() => {
		show = true;
	}, 1000);
</script>

{#if !dismissed && show}
	<div transition:scale class="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
		<div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
			<div class="p-2 rounded-lg bg-indigo-600 shadow-lg sm:p-3">
				<div class="flex items-center justify-between flex-wrap">
					<div class="w-0 flex-1 flex items-center">
						<span class="flex p-2 rounded-lg bg-indigo-800">
							<Fa icon={faBullhorn} size={'lg'} class="text-white" />
						</span>
						<p class="ml-3 font-medium text-white truncate">
							<span class="md:hidden"> We now have a public Discord server. </span>
							<span class="hidden md:inline">
								Big news! We now have a public Discord server. Join us!
							</span>
						</p>
					</div>
					<div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
						<a
							href="https://discord.gg/AskvnXsYxd"
							target="_blank"
							class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
						>
							Join now
						</a>
					</div>
					<div class="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
						<button
							on:click={() => {
								$dissmissableContents.discordBanner = true;
							}}
							type="button"
							class="-mr-1 flex px-3 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
						>
							<span class="sr-only">Dismiss</span>
							<Fa icon={faXmark} scale={1.5} class="text-white" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
