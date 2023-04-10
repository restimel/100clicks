/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { get } from 'svelte/store';
import sounds from '../credits/sounds';
import { musicVolume, mute, soundVolume } from './settings';
import type { SoundAlias, SoundEffect, SoundTrack, ThemeAmbient } from './types';
import { browser } from '$app/environment';

type Stop = () => void;
type Mode = {
    mode: 'sound' | 'ambient';
    next?: (id: string, info?: number) => void;
    info?: number;
};

type AudioInfo = {
    duration: number;
    time: number;
}
type AudioOptions = {
    startOffset: number;
    maxDuration: number;
    nextCalled: boolean;
    muted: boolean;
    volume: number;
}

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
    ['artifactUsage', {
        id: 'artifactUsage',
        repeat: Infinity,
        alias: [{
            name: 'steamPipe',
            variant: 0,
        }],
    }],
    ['steam', {
        alias: ['steamHisses', {
            name: 'steamPipe',
            variant: 1,
        }],
    }],
]);

const theme: ThemeAmbient = {
    musics: [{
        name: 'factory',
        beforeEnd: 2000,
    }, {
        name: 'darkCaveFactory',
        beforeEnd: 2000,
    }, {
        name: 'insideMachine',
        beforeEnd: 2000,
    }],
    ambients: [{
        name: 'steam',
        delay: 5000,
    }, {
        name: 'steam',
        delay: 3000,
    }, {
        name: 'steam',
        repeat: 2,
        delay: 500,
    }, {
        name: 'steam',
    }, {
        name: 'steam',
        followed: {
            name: 'steam',
        }
    }, {
        name: 'wind',
    }, {
        name: 'wind',
    }, {
        name: 'clockTicks',
        duration: 5000,
        delay: 5000,
        volume: 40,
        effect: ['fade-in', 'fade-out'],
    }, {
        name: 'windFarm',
        volume: 27,
    }],
};

const playingSounds = new Map<string, Stop>();
const ambientList = new Set<string>();

export function stopSound(id: string) {
    const stop = playingSounds.get(id);
    stop?.();
}

function audioInfo(el: HTMLAudioElement, options: AudioOptions): AudioInfo {
    const {startOffset, maxDuration} = options;
    const duration = Math.min(el.duration - startOffset, maxDuration / 1000);
    const time = el.currentTime - startOffset;

    return {
        time,
        duration,
    }
}

function addEffects(el: HTMLAudioElement, options: AudioOptions, timeUpdateCb: Set<() => void>, effects: SoundEffect | SoundEffect[]) {
    if (Array.isArray(effects)) {
        effects.forEach((effect) => {
            addEffects(el, options, timeUpdateCb, effect);
        });
        return;
    }
    switch (effects) {
        case 'fade-in':
            timeUpdateCb.add(() => {
                if (options.muted) {
                    return;
                }
                const {duration, time} = audioInfo(el, options);
                const threshold = duration < 4 ? duration * 0.25 : 1;

                if (time < threshold) {
                    const ratio = time / threshold;
                    el.volume = options.volume * ratio;
                }
            });
            break;
        case 'fade-out':
            timeUpdateCb.add(() => {
                if (options.muted) {
                    return;
                }
                const {duration, time} = audioInfo(el, options);
                const threshold = duration < 4 ? duration * 0.75 : duration - 1;

                if (time > threshold) {
                    const ratio = (duration - time) / (duration - threshold);
                    el.volume = options.volume * ratio;
                }
            });
            break;
    }
}

function createSound(url: string, options: SoundTrack, mode: Mode) {
    if (!browser) {
        return;
    }
    const correctionVolume = (options.volume ?? 100) / 100 * (mode.mode === 'ambient' ? 0.75 : 1);

    const id = options.id ?? '';
    let repeat = options.repeat ?? 1;
    const globalVolume = mode.mode === 'sound' ? soundVolume : musicVolume;
    const audioOptions: AudioOptions = {
        startOffset: (options.start ?? 0) / 1000,
        maxDuration: options.duration ?? Infinity,
        nextCalled: false,
        muted: get(mute),
        volume: get(globalVolume),
    };

    stopSound(id);

    const el = document.createElement('audio');
    el.src = url;

    const updateVolume = () => {
        const volume = audioOptions.muted ? 0 : audioOptions.volume;

        el.volume = volume;
    };
    const unsubscribeVolume = globalVolume.subscribe((value) => {
        audioOptions.volume = value / 100 * correctionVolume;
        updateVolume();
    });
    const unsubscribeMuted = mute.subscribe((value) => {
        audioOptions.muted = value;
        updateVolume();
    });
    updateVolume();

    const timeUpdateCb: Set<() => void> = new Set();


    const quickEnd = () => {
        const {duration, time} = audioInfo(el, audioOptions);
        /* 1ms is to avoid having blank */
        if (time >= duration - 1) {
            end();
        }
    };
    const tabVisibility = () => {
        if (document.visibilityState === 'visible') {
            el.play();
        } else {
            el.pause();
        }
    };
    const start = () => {
        el.currentTime = audioOptions.startOffset;
        el.play();
        if (repeat || isFinite(audioOptions.maxDuration)) {
            quickEnd
            if (!timeUpdateCb.has(quickEnd)) {
                el.addEventListener('timeupdate', quickEnd);
                timeUpdateCb.add(quickEnd);
            }
        }
    };
    const stop = () => {
        el.pause();
        playingSounds.delete(id);
        ambientList.delete(id);
        document.removeEventListener('visibilitychange', tabVisibility);
        el.removeEventListener('ended', end);
        el.removeEventListener('abort', stop);
        el.removeEventListener('error', stop);
        timeUpdateCb.forEach((cb) => {
            el.removeEventListener('timeupdate', cb);
        });
        unsubscribeVolume();
        unsubscribeMuted();
        repeat = 0;
    };
    const end = () => {
        if (--repeat > 0) {
            start();
            return;
        }

        stop();
        const followed = options.followed;
        if (followed) {
            playSound(followed.name, {id, ...followed});
        } else if (mode.next && !audioOptions.nextCalled) {
            audioOptions.nextCalled = true;
            mode.next(id, mode.info);
        }
    };
    el.addEventListener('ended', end);
    el.addEventListener('abort', stop);
    el.addEventListener('error', stop);
    if (options.effect) {
        addEffects(el, audioOptions, timeUpdateCb, options.effect);
    }
    if (mode.next && options.beforeEnd) {
        timeUpdateCb.add(() => {
            if (!audioOptions.nextCalled) {
                const {duration, time} = audioInfo(el, audioOptions);
                const threshold = duration - options.beforeEnd! / 1000;

                if (time > threshold) {
                    audioOptions.nextCalled = true;
                    mode.next!(id, mode.info);
                }
            }
        });
    }
    timeUpdateCb.forEach((cb) => {
        el.addEventListener('timeupdate', cb);
    });

    document.addEventListener('visibilitychange', tabVisibility);

    start();
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
    const soundOptions = {...options};

    if (alias.has(id)) {
        const item = alias.get(id)!;
        if (item.files) {
            files.push(...item.files);
        }
        item.alias.forEach((soundItem) => {
            if (typeof soundItem === 'string') {
                const sound = sounds.get(soundItem);
                if (sound) {
                    files.push(...sound.files);
                }
            } else {
                const sound = sounds.get(soundItem.name);
                if (sound) {
                    if (typeof soundItem.variant === 'number') {
                        const file = sound.files[soundItem.variant];
                        if (file) {
                            files.push(file);
                        }
                    } else {
                        files.push(...sound.files);
                    }
                }
            }
        });
        if (item.id) {
            soundOptions.id = item.id;
        }
        if (item.repeat) {
            soundOptions.repeat = item.repeat;
        }
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
        setTimeout(createSound, delay, files[fileIdx], soundOptions, mode);
    } else {
        createSound(files[fileIdx], soundOptions, mode);
    }
    return true;
}


const ID_MUSIC = 'theme-music';
const ID_AMBIENT_1 = 'theme-ambient1';
const ID_AMBIENT_2 = 'theme-ambient2';
export function playAmbient() {
    const musics = theme.musics;
    const ambients = theme.ambients;
    const next = (id: string, lastIdx?: number) => {
        const type = id.startsWith(ID_MUSIC) ? ID_MUSIC
            : id.startsWith(ID_AMBIENT_1) ? ID_AMBIENT_1
            : ID_AMBIENT_2;
        /* identify next track */
        const list = type === ID_MUSIC ? musics : ambients;
        let idx = Math.floor(Math.random() * list.length);
        if (idx === lastIdx) {
            idx = (idx + 1) % list.length;
        }
        const sound = list[idx];

        const name = sound?.name || '';
        const additionalDelay = type === ID_MUSIC ? 0 : Math.random() * 30000;
        const delay = (sound?.delay ?? 0) + additionalDelay;

        const newId = `${type} - ${idx}`;
        ambientList.add(newId);

        if (!name) {
            return;
        }
        playSound(name, {...sound, id: newId, delay}, {...musicMode, info: idx});
    };

    const musicMode: Mode = {
        mode: 'ambient',
        next: next,
    };

    next(ID_MUSIC);
    next(ID_AMBIENT_1);
    next(ID_AMBIENT_2);
}

export function stopAmbient() {
    ambientList.forEach((id) => {
        stopSound(id);
    })
}
