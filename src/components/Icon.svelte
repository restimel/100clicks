<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { IconDefinition, IconDesc } from "../stores/types";

    const dispatch = createEventDispatcher<{click: void}>();

	export let icon: IconDesc;
	export let title: string = '';

    $: icons = Array.isArray(icon) ? icon : [icon];
    $: iconsDef = icons.map((icon): IconDefinition => {
        if (typeof icon === 'string') {
            return {
                icon: icon,
                size: '',
            };
        }
        return {
            size: 'fa-stack-1x',
            ...icon,
        };
    });

    function getStyle(transformation?: string) {
        if (!transformation) {
            return '';
        }

        const transform = transformation
            .replace(/(shrink|grow|right|left|down|up|rotate|flip)-(-?\d+|[vh])|./g, (_, action, value) =>
            {
                switch(action) {
                    case 'shrink': return ` scale(${(16 - value) * 100 / 16}%)`;
                    case 'grow': return ` scale(${100 + value * 100 / 16}%)`;
                    case 'right': return ` translateX(${(16 - value) * 100 / 16}%)`;
                    case 'left': return ` translateX(-${(16 - value) * 100 / 16}%)`;
                    case 'down': return ` translateY(${(16 - value) * 100 / 16}%)`;
                    case 'up': return ` translateY(-${(16 - value) * 100 / 16}%)`;
                    case 'rotate': return ` rotate(${value * 360 / 16}deg)`;
                    case 'flip': if (value === 'h') {
                        return ` rotateY(180deg)`;
                    } else if (value === 'v') {
                        return ` rotateX(180deg)`;
                    }
                    default: return '';
                }
            }
        );
        if (!transform) {
            return '';
        }
        return 'transform:' + transform;
    }
</script>

{#if iconsDef.length > 1}
    <span
        class={`fa-stack small fa-fw ${$$props.class ?? ''}`}
        title={title}
        on:click={() => dispatch('click')}
    >
        {#each iconsDef as icon}
            <i
                class={`${icon.icon} ${icon.size}`}
                data-fa-transform={icon.transformation}
                style={getStyle(icon.transformation)}
            ></i>
        {/each}
    </span>
{:else}
    <i
        class={`${$$props.class ?? ''} ${iconsDef[0].icon} ${iconsDef[0].size} fa-fw`}
        data-fa-transform={iconsDef[0].transformation}
        style={getStyle(iconsDef[0].transformation)}
        title={title}
        on:click={() => dispatch('click')}
    ></i>
{/if}

<style>
.fa-stack.small {
    transform: scale(0.5);
}

.fa-stack {
    height: inherit;
    width: 1ch;
    vertical-align: text-top;
    padding-right: 0.5ch;
}

.fa-stack-2x {
    transform: translate(-50%);
}
</style>
