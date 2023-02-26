<script lang="ts">
	export let text: string;

    $: chunkText = splitText(text);

    type Chunk = {
        content: string | string[];
        type: 'text' | 'icon';
        title?: string;
    };

    const icons: Record<string, [string | string[], string]> = {
        ':click:': ['fa-regular fa-hand-pointer', 'Click'],
        ':clicks:': ['fa-regular fa-hand-pointer', 'Click'],
        ':lostClick:': ['fa-solid fa-ghost', 'Lost click'],
        ':lostClicks:': ['fa-solid fa-ghost', 'Lost click'],
        ':energy:': ['fa-solid fa-bolt-lightning', 'Energy'],
        ':energyMax:': [['fa-solid fa-circle fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], 'Energy max'],
        ':temporalEnergy:': [['fa-solid fa-calendar fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], 'Temporal energy'],
        ':tEnergy:': [['fa-solid fa-calendar fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], 'Temporal energy'],
        ':warning:': ['fa-solid fa-triangle-exclamation', '???'],
    };

    function splitText(rawText: string): Chunk[] {
        const splittedText = rawText.split(/(:\w+:)/);
        const chunks: Chunk[] = [];

        splittedText.forEach((str) => {
            if (str.startsWith(':') && str.endsWith(':')) {
                const icon = icons[str] ?? icons[':warning:'];
                chunks.push({
                    type: 'icon',
                    content: icon[0],
                    title: icon[1],
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
        {#if Array.isArray(content)}
            <span class="fa-stack small fa-fw" title={title}>
                {#each content as classNames}
                    <i class={classNames}></i>
                {/each}
            </span>
        {:else}
            <i class="{content} fa-fw" title={title}></i>
        {/if}
    {/if}
{/each}

<style>
.fa-stack.small {
    font-size: 0.5em;
}
</style>
