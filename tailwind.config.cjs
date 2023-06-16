/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			height: {
				cx1: 'calc(100vh - 176px)'
			}
		}
	},
	plugins: []
};
