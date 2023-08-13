<script lang="ts">
    import { _ } from 'svelte-i18n';
    import Icon from './Icon.svelte';
    import { icons } from '../helpers/icons';

    import type { IconDesc } from '../stores/types';

    export let text: string;

    $: chunkText = splitText(text);

    type Chunk = {
        content: string | IconDesc;
        type: 'text' | 'icon' | 'line-feed' | 'italic' | 'bold' | 'link';
        title?: string;
    };

    function splitText(rawText: string): Chunk[] {
        const splittedText = rawText.split(/(:\w+:|[\n]|_\w[\s\S]*\w_|\*{2}\w[\s\S]*\w\*{2}|\[[^\]\n]+\]\([^)\n]+\))/);
        const chunks: Chunk[] = [];

        splittedText.forEach((str) => {
            if (str.startsWith(':') && str.endsWith(':')) {
                const icon = icons.get(str) ?? icons.get(':warning:')!;
                chunks.push({
                    type: 'icon',
                    content: icon[0],
                    title: icon[1],
                });
            } else if (str === '\n') {
                chunks.push({
                    type: 'line-feed',
                    content: '\n',
                });
            } else if (str.startsWith('_') && str.endsWith('_')) {
                chunks.push({
                    type: 'italic',
                    content: str.slice(1, -1),
                });
            } else if (str.startsWith('*') && str.endsWith('*')) {
                chunks.push({
                    type: 'bold',
                    content: str.slice(2, -2),
                });
            } else if (str.startsWith('[') && str.endsWith(')')) {
                const data = str.match(/^\[(?<text>[^\]\n]+)\]\((?<url>[^)\n]+)\)$/);
                const url = data?.groups?.url;
                if (url !== '{url}') {
                    chunks.push({
                        type: 'link',
                        title: url ?? '',
                        content: data?.groups?.text ?? '',
                    });
                } else {
                    /* Hack in order to Build with Svelte.
                     * Otherwise the compiler should complain about '{url}' is
                     * not reachable...
                     * NOTE: We should never execute these line of code */
                    chunks.push({
                        type: 'text',
                        title: url ?? '',
                        content: data?.groups?.text ?? '',
                    });
                }
            } else {
                if (str.trim()) {
                    chunks.push({
                        type: 'text',
                        content: str,
                    });
                }
            }
        });

        return chunks;
    }
</script>

{#each chunkText as {type, content, title}}
    {#if type === 'text'}
        <span>
            {content}
        </span>
    {:else if type === 'icon'}
        <Icon icon={content} title={$_(title ?? '')} />
    {:else if type === 'line-feed'}
        <br>
    {:else if type === 'italic'}
        <span class="text-italic">
            <svelte:self text={content} />
        </span>
    {:else if type === 'bold'}
        <span class="text-bold">
            <svelte:self text={content} />
        </span>
    {:else if type === 'link'}
        <a target="_blank" href={title} rel="noreferrer">
            <svelte:self text={content} />
        </a>
    {/if}
{/each}

<style>
.text-italic {
    font-style: italic;
}
.text-bold {
    font-weight: bold;
}
</style>
