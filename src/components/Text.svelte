<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { splitText } from '../helpers/text';
    import Icon from './Icon.svelte';

    export let text: string;

    $: chunkText = splitText(text);

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
    {:else if type === 'justify'}
        <p class="text-justify">
            <svelte:self text={content} />
        </p>
    {:else if type === 'center'}
        <p class="text-center">
            <svelte:self text={content} />
        </p>
    {:else if type === 'link'}
        <a target="_blank" href={title} rel="noreferrer">
            <svelte:self text={content} />
        </a>
    {:else if type === 'markdown'}
        <svelte:self text={content} />
    {/if}
{/each}

<style>
.text-italic {
    font-style: italic;
}
.text-bold {
    font-weight: bold;
}
.text-justify {
    text-align: justify;
}
.text-center {
    text-align: center;
}
</style>
