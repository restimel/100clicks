import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
    server: { https: true },
    plugins: [
        mkcert(),
        VitePWA({ registerType: 'autoUpdate' }),
        sveltekit(),
    ],
});
