import { hadAtLeast, hasValue } from '../../../helpers/achievementHelpers';
import { ownEquipments } from '../../run';
import type { AchievementDefinition } from '../../types';


export default function createAchievement(): AchievementDefinition[] {
    const hadEnergy = hasValue('energy');
    const hadEquipment =  hadAtLeast(ownEquipments);

    return [
        ['hadEnergy', hadEnergy],
        ['hadEquipment', hadEquipment],
    ];
}
