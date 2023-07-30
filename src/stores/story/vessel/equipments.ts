import { $t } from '../../../locales/i18n';
import type { EquipmentDefinition } from '../../types';
import type { StoryResource } from './resources';

const equipments: EquipmentDefinition<StoryResource>[] = [{
    id: 'card-staff-1',
    title: $t('equipment.card1.title'),
    fluff: $t('equipment.card1.fluff'),
    icon: 'fa-solid fa-address-card',
}, {
    id: 'card-staff-2',
    title: $t('equipment.card2.title'),
    fluff: $t('equipment.card2..fluff'),
    icon: 'fa-solid fa-address-card',
}, {
    id: 'paper',
    title: $t('equipment.paper.title'),
    fluff: $t('equipment.paper.fluff'),
    icon: 'fa-solid fa-scroll',
}, {
    id: 'pencil',
    title: $t('equipment.pencil.title'),
    fluff: $t('equipment.pencil.fluff'),
    icon: 'fa-solid fa-pencil',
}];

export default equipments;
