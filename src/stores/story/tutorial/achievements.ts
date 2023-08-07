import { hadAtLeast, hasValue, isEmptyAfter } from '../../../helpers/achievementHelpers';
import { ownArtifacts } from '../../run';
import type { AchievementDefinition } from '../../types';


export default function createAchievement(): AchievementDefinition[] {
    const win1 = isEmptyAfter('monster');
    const win2 = isEmptyAfter('monster', win1);
    const win3 = isEmptyAfter('monster', win2);

    return [
        ['hadWarrior', hasValue('warrior')],
        ['hadSword', hasValue('sword')],
        ['hadReputation', hasValue('reputation')],
        ['win1', win1],
        ['win2', win2],
        ['win3', win3],
        ['hadArtifact', hadAtLeast(ownArtifacts)],
    ];
}
