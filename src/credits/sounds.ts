import type { SoundCredit } from '../stores/types';

import stuck1 from '$lib/sounds/mechanism-stuck1.ogg';
import stuck2 from '$lib/sounds/mechanism-stuck2.ogg';
import lightOnOff1 from '$lib/sounds/light-switch-on-off1.ogg';
import clockTickSound1 from '$lib/sounds/clockticksound_01.ogg';
import signal7 from '$lib/sounds/signal-7.ogg';
import tapeRecorder2 from '$lib/sounds/tape-recorder2.ogg';
import tapeRecorder3 from '$lib/sounds/tape-recorder3.ogg';
import tapeRecorder4 from '$lib/sounds/tape-recorder4.ogg';

import factory from '$lib/sounds/factory-atmo.ogg';

const sounds = new Map<string, SoundCredit>([
    ['stuck', {
        title: 'Mechanism Stuck',
        author: 'Iwan Gabovitch',
        site: 'freesound',
        url: 'https://freesound.org/people/qubodup/sounds/194882/',
        license: 'by4',
        files: [
            stuck1,
            stuck2,
        ],
    }],
    ['lightSwitchOnOff', {
        title: 'Light Switch On Off',
        author: 'Iwan \'qubodup\' Gabovitch',
        site: 'freesound',
        url: 'https://freesound.org/people/qubodup/sounds/183994/',
        license: 'cc0',
        files: [
            lightOnOff1,
        ],
    }],
    ['clockTicks', {
        title: 'ClockTickSound_01',
        author: 'abyeditsound',
        site: 'freesound',
        url: 'https://freesound.org/people/abyeditsound/sounds/450509/',
        license: 'cc0',
        files: [
            clockTickSound1,
        ],
    }],
    ['signal', {
        title: 'Cinematic violin from another galaxy_Steampunk computer signal 7',
        author: 'Joshua Hudes Music Production',
        site: 'freesound',
        url: 'https://freesound.org/people/louislingg/sounds/608590/',
        license: 'by4',
        files: [
            signal7,
        ],
    }],
    ['tape-recorder', {
        title: 'Tape Recorder',
        author: 'Pogotron',
        site: 'freesound',
        url: 'https://freesound.org/people/Pogotron/sounds/61075/',
        license: 'by-nc4',
        files: [
            tapeRecorder2,
            tapeRecorder3,
            tapeRecorder4,
        ],
    }],

    /* atmosphere */
    ['factory', {
        title: 'Factory Atmo',
        author: 'szegvari',
        site: 'freesound',
        url: 'https://freesound.org/people/szegvari/sounds/580455/',
        license: 'cc0',
        files: [
            factory,
        ],
    }],
]);

export default sounds;
