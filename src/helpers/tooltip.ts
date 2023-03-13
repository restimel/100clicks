import Tooltip from './tooltip/Tooltip.svelte';
import type { SvelteComponent } from 'svelte';

export function tooltip(element: HTMLElement, content: string) {
	let title: string = content ?? '';
	let tooltipComponent: SvelteComponent;

	function create(event: MouseEvent) {
        /* remove potential previous tooltip */

        destroy();
		tooltipComponent = new Tooltip({
			props: {
				title: title,
				x: event.pageX,
				y: event.pageY,
			},
			target: document.body,
		});
	}
	function mouseMove(event: MouseEvent) {
		tooltipComponent?.$set({
			x: event.pageX,
			y: event.pageY,
		});
	}
	function destroy() {
		tooltipComponent?.$destroy();
        (tooltipComponent as unknown) = null;
	}

	element.addEventListener('mouseenter', create);
    element.addEventListener('mouseleave', destroy);
	element.addEventListener('mousemove', mouseMove);

	return {
		destroy() {
			element.removeEventListener('mouseenter', create);
			element.removeEventListener('mouseleave', destroy);
			element.removeEventListener('mousemove', mouseMove);
		},
        update(content: string) {
            title = content ?? '';
            if (tooltipComponent) {
                tooltipComponent.$set({
                    title,
                });
            }
        }
	};
}
