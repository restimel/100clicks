import { ResizeObserver as PolyfillResizeObserver } from '@juggle/resize-observer';

function ResizeObserver(callback: ResizeObserverCallback): ResizeObserver {
    const Observer = globalThis.ResizeObserver;
    if (!Observer) {
        return new PolyfillResizeObserver(callback);
    }
    return new Observer(callback);
}
declare class ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    observe(target: Element, options?: ResizeObserverOptions): void;
    unobserve(target: Element): void;
    disconnect(): void;
    static toString(): string;
}

export { ResizeObserver };
