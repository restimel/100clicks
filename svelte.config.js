import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
        paths: {
            base: dev ? '' : '/100clicks',
            // base: dev ? '' : process.env.BASE_PATH,
        },
	},

	onwarn: (warning, handler) => {
		if (warning.code === 'a11y-click-events-have-key-events') {
			return;
		}
		handler(warning);
	},
};

export default config;
