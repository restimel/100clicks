import { SvelteComponent } from 'svelte';
import Tooltip from './tooltip/Tooltip.svelte';

export function tooltip(element, content: string) {
	let title: string = content ?? '';
	let tooltipComponent: SvelteComponent;

	function create(event) {
        /* remove potential previous tooltip */

        destroy();
		tooltipComponent = new (Tooltip as any)({
			props: {
				title: title,
				x: event.pageX,
				y: event.pageY,
			},
			target: document.body,
		});
	}
	function mouseMove(event) {
		tooltipComponent.$set({
			x: event.pageX,
			y: event.pageY,
		});
	}
	function destroy() {
		tooltipComponent?.$destroy();
        tooltipComponent = null;
	}

	element.addEventListener('mouseover', create);
    element.addEventListener('mouseleave', destroy);
	element.addEventListener('mousemove', mouseMove);

	return {
		destroy() {
			element.removeEventListener('mouseover', create);
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
