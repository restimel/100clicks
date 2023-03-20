/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { get } from 'svelte/store';
import sounds from '../credits/sounds';
import { noop } from '../helpers/common';
import { soundVolume } from './settings';
import type { SoundAlias, SoundTrack } from './types';

const alias = new Map<string, SoundAlias>([
    ['click', {
        alias: ['lightSwitchOnOff'],
    }],
    ['action', {
        alias: ['stuck'],
    }],
    ['error', {
        alias: ['signal'],
    }],
]);

const playingSounds = new Map<string, () => void>();

export function stopSound(id: string) {
    const stop = playingSounds.get(id);
    stop?.();
}

function createSound(url: string, options: SoundTrack = {}) {
    const correctionVolume = (options.volume ?? 100) / 100;
    const volume = get(soundVolume) / 100 * correctionVolume;
    if (volume <= 0) {
        return;
    }
    const id = options.id ?? '';
    const maxDuration = options.duration ?? Infinity;
    const startOffset = (options.start ?? 0) / 1000;
    let repeat = options.repeat ?? 1;

    stopSound(id);

    const el = document.createElement('audio');
    el.src = url;
    el.volume = volume;

    let effect = noop;
    const stop = () => {
        el.pause();
        clearTimeout(durationTimer);
        document.body.removeChild(el);
        el.removeEventListener('ended', end);
        el.removeEventListener('abort', stop);
        el.removeEventListener('timeupdate', effect);
        playingSounds.delete(id);
    };
    const end = () => {
        if (--repeat > 0) {
            el.play();
            return;
        }

        stop();
        const followed = options.followed;
        if (followed) {
            playSound(followed.name, {id, ...followed});
        }
    };
    el.addEventListener('ended', end);
    el.addEventListener('abort', stop);
    if (options.effect) {
        switch (options.effect) {
            case 'fade-in':
                effect = () => {
                    const duration = Math.min(el.duration - startOffset, maxDuration / 1000);
                    const threshold = duration < 4 ? duration * 0.25 : 1;
                    const time = el.currentTime - startOffset;

                    if (time < threshold) {
                        const ratio = time / threshold;
                        el.volume = volume * ratio;
                    }
                };
                break;
            case 'fade-out':
                effect = () => {
                    const duration = Math.min(el.duration - startOffset, maxDuration / 1000);
                    const threshold = duration < 4 ? duration * 0.75 : duration - 1;
                    const time = el.currentTime - startOffset;

                    if (time > threshold) {
                        const ratio = (duration - time) / (duration - threshold);
                        el.volume = volume * ratio;
                    }
                };
                break;
        }
        el.addEventListener('timeupdate', effect);
    }

    let durationTimer = 0;
    if (isFinite(maxDuration)) {
        durationTimer = setTimeout(stop, maxDuration) as unknown as number;
    }

    document.body.appendChild(el);

    el.currentTime = startOffset;
    el.play();
    if (id) {
        playingSounds.set(id, stop);
    }
}

export function playSound(id: string, options: SoundTrack = {}): boolean {
    const {variant, delay} = options;
    const files: string[] = [];

    if (alias.has(id)) {
        const item = alias.get(id)!;
        if (item.files) {
            files.push(...item.files);
        }
        item.alias.forEach((soundId) => {
            const sound = sounds.get(soundId);
            if (sound) {
                files.push(...sound.files);
            }
        });
    } else if (sounds.has(id)) {
        const sound = sounds.get(id)!;
        files.push(...sound.files);
    } else {
        console.warn('sound "%s" not found', id);
        return false;
    }
    let fileIdx = variant;
    if (fileIdx === undefined) {
        fileIdx = Math.floor(Math.random() * files.length);
    }

    if (delay) {
        setTimeout(createSound, delay, files[fileIdx], options);
    } else {
        createSound(files[fileIdx], options);
    }
    return true;
}
