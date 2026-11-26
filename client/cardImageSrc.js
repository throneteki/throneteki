import { Constants } from './constants';

export const cardImageSrc = (code) =>
    Constants.FactionsImagePaths[code] || `/img/cards/${code}.png`;
