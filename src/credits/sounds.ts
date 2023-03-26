import type { SoundCredit } from '../stores/types';

import stuck1 from '$lib/sounds/mechanism-stuck1.ogg';
import stuck2 from '$lib/sounds/mechanism-stuck2.ogg';
import lightOnOff1 from '$lib/sounds/light-switch-on-off1.ogg';
import clockTickSound1 from '$lib/sounds/clockticksound_01.ogg';
import signal7 from '$lib/sounds/signal-7.ogg';
import tapeRecorder2 from '$lib/sounds/tape-recorder2.ogg';
import tapeRecorder3 from '$lib/sounds/tape-recorder3.ogg';
import tapeRecorder4 from '$lib/sounds/tape-recorder4.ogg';
import steamHisses1 from '$lib/sounds/steam hisses-1.ogg';
import steamHisses2 from '$lib/sounds/steam hisses-2.ogg';
import steamHisses3 from '$lib/sounds/steam hisses-3.ogg';
import steamHisses4 from '$lib/sounds/steam hisses-4.ogg';
import steamPipe1 from '$lib/sounds/steam-pipe-1.ogg';
import steamPipe2 from '$lib/sounds/steam-pipe-2.ogg';
import wind1 from '$lib/sounds/soft-wind.ogg';
import windFarm1 from '$lib/sounds/esperance-wind-farm-ii.ogg';

import factory from '$lib/sounds/factory-atmo.ogg';
import darkCaveFactory from '$lib/sounds/dark-cave-factory-atmo.ogg';
import insideMachine1 from '$lib/sounds/inside-the-machine-1.ogg';

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
    ['steamHisses', {
        title: 'Steam release sounds',
        author: 'Bart Kelsey',
        site: 'OpenGameArt',
        url: 'https://opengameart.org/content/steam-release-sounds',
        license: 'cc0',
        files: [
            steamHisses1,
            steamHisses2,
            steamHisses3,
            steamHisses4,
        ],
    }],
    ['steamPipe', {
        title: 'steam pipe 2',
        author: 'visions68',
        site: 'freesound',
        url: 'https://freesound.org/people/visions68/sounds/278998/',
        license: 'by3',
        files: [
            steamPipe1,
            steamPipe2,
        ],
    }],
    ['wind', {
        title: 'Soft Wind',
        author: 'Florian Reichelt',
        site: 'freesound',
        url: 'https://freesound.org/people/florianreichelt/sounds/459977/',
        license: 'cc0',
        files: [
            wind1,
        ],
    }],
    ['windFarm', {
        title: 'Esperance Wind Farm II',
        author: 'kangaroovindaloo',
        site: 'freesound',
        url: 'https://freesound.org/people/kangaroovindaloo/sounds/180025/',
        license: 'by4',
        files: [
            windFarm1,
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
    ['darkCaveFactory', {
        title: 'Dark Cave Factory Atmo',
        author: 'szegvari',
        site: 'freesound',
        url: 'https://freesound.org/people/szegvari/sounds/583474/',
        license: 'cc0',
        files: [
            darkCaveFactory,
        ],
    }],
    ['insideMachine', {
        title: 'Inside the machine 1',
        author: 'digitalperformer',
        site: 'freesound',
        url: 'https://freesound.org/people/digitalperformer/sounds/325414/',
        license: 'cc0',
        files: [
            insideMachine1,
        ],
    }],
]);

export default sounds;
