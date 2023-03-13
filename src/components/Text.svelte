<script lang="ts">
    import { _ } from 'svelte-i18n';
    import Icon from './Icon.svelte';
    import { icons } from '../helpers/icons';

    import type { IconDesc } from '../stores/types';

	export let text: string;

    $: chunkText = splitText(text);

    type Chunk = {
        content: string | IconDesc;
        type: 'text' | 'icon' | 'line-feed' | 'italic' | 'bold';
        title?: string;
    };

    function splitText(rawText: string): Chunk[] {
        const splittedText = rawText.split(/(:\w+:|[\n]|_\w.*\w_|\*{2}\w.*\w\*{2})/);
        const chunks: Chunk[] = [];

        splittedText.forEach((str) => {
            if (str.startsWith(':') && str.endsWith(':')) {
                const icon = icons[str] ?? icons[':warning:'];
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
