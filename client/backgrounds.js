import { DefaultBackground } from '../shared/backgrounds';
import BlankBg from './assets/img/bgs/blank.webp';
import StandardBg from './assets/img/bgs/background.webp';
import WinterBg from './assets/img/bgs/background2.webp';

export const BuiltInBackgrounds = [
    { name: 'none', label: 'None', imageUrl: BlankBg },
    { name: 'BG1', label: 'Standard', imageUrl: StandardBg },
    { name: 'BG2', label: 'Winter', imageUrl: WinterBg }
];

export const builtInBackgroundUrl = (name) =>
    (
        BuiltInBackgrounds.find((background) => background.name === name) ||
        BuiltInBackgrounds.find((background) => background.name === DefaultBackground)
    ).imageUrl;
