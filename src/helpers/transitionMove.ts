import { crossfade } from 'svelte/transition';

export const [send, receive] = crossfade({
    duration: 500,

    fallback(node) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;

        return {
            duration: 300,
            // easing: quintOut,
            css: val => `
                transform: ${transform} scale(${val});
                opacity: ${val}
            `
        };
    },
});
