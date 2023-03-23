/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { get } from 'svelte/store';
import sounds from '../credits/sounds';
import { noop } from '../helpers/common';
import { musicVolume, mute, soundVolume } from './settings';
import type { SoundAlias, SoundTrack, ThemeAmbient } from './types';
import { browser } from '$app/environment';

type Stop = () => void;
type Mode = {
    mode: 'sound' | 'ambient';
    next?: (id: string) => void;
};

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

const theme: ThemeAmbient = {
    musics: [{
        name: 'factory',
    }],
    ambients: [],
};

const playingSounds = new Map<string, Stop>();

export function stopSound(id: string) {
    const stop = playingSounds.get(id);
    stop?.();
}

function createSound(url: string, options: SoundTrack, mode: Mode) {
    if (!browser) {
        return;
    }
    const correctionVolume = (options.volume ?? 100) / 100;

    const id = options.id ?? '';
    const maxDuration = options.duration ?? Infinity;
    const startOffset = (options.start ?? 0) / 1000;
    let repeat = options.repeat ?? 1;
    const globalVolume = mode.mode === 'sound' ? soundVolume : musicVolume;
    let normalVolume = get(globalVolume);

    stopSound(id);

    const el = document.createElement('audio');
    el.src = url;

    const updateVolume = (value: number) => {
        const volume = get(mute) ? 0 : value / 100 * correctionVolume;

        el.volume = volume;
        normalVolume = volume;
    };
    const unsubscribeVolume = globalVolume.subscribe(updateVolume);
    updateVolume(normalVolume);

    let effect = noop;

    const stop = () => {
        el.pause();
        clearTimeout(durationTimer);
        playingSounds.delete(id);
        document.body.removeChild(el);
        el.removeEventListener('ended', end);
        el.removeEventListener('abort', stop);
        el.removeEventListener('timeupdate', effect);
        unsubscribeVolume();
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
        } else if (mode.next) {
            mode.next(id);
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
                        el.volume = normalVolume * ratio;
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
                        el.volume = normalVolume * ratio;
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

const soundMode: Mode = {
    mode: 'sound',
};

export function playSound(id: string, options: SoundTrack = {}, mode = soundMode): boolean {
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
        setTimeout(createSound, delay, files[fileIdx], options, mode);
    } else {
        createSound(files[fileIdx], options, mode);
    }
    return true;
}


const ID_MUSIC = 'theme-music';
const ID_AMBIENT_1 = 'theme-ambient1';
const ID_AMBIENT_2 = 'theme-ambient2';
export function playAmbient() {
    const musics = theme.musics;
    const ambients = theme.ambients;
    const next = (id: string) => {
        const list = id === ID_MUSIC ? musics : ambients;
        const idx = Math.floor(Math.random() * list.length);
        const sound = list[idx];
        const name = sound?.name || '';
        const additionalDelay = id === ID_MUSIC ? 0 : Math.random() * 60000;
        const delay = (sound?.delay ?? 0) + additionalDelay;

        if (!name) {
            return;
        }
        playSound(name, {...sound, id, delay}, musicMode);
    };

    const musicMode: Mode = {
        mode: 'ambient',
        next: next,
    };

    next(ID_MUSIC);
    next(ID_AMBIENT_1);
    next(ID_AMBIENT_2);
}
