export const autoMinScale = 0.5;
export const autoMaxScale = 2;
const autoStep = 0.05;

// Space the board needs at scale 1 (in rem), including the parts that do not scale with cards
const autoLayoutRem = { width: 56, height: 56 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const computeAutoCardScale = ({ width, height, rem = 16 }) => {
    const fit = Math.min(
        width / (autoLayoutRem.width * rem),
        height / (autoLayoutRem.height * rem)
    );

    return clamp(Math.floor(fit / autoStep) * autoStep, autoMinScale, autoMaxScale);
};

export const settleAutoCardScale = (current, next) => {
    if (current === null || current === undefined || next < current) {
        return next;
    }

    return next - current >= autoStep * 2 - 1e-9 ? next : current;
};

export const cardBoxClass = (orientation = 'vertical') => {
    switch (orientation) {
        case 'horizontal':
            return 'card-box-horizontal';
        case 'kneeled':
            return 'card-box-horizontal card-box-kneeled';
        case 'rotated':
            return 'card-box card-box-rotated';
        default:
            return 'card-box';
    }
};

// The card size an element is drawn at. Parts of the board draw cards at their own sizes (a hand, a pile, a sheet)
// by setting --card-scale on themselves, so a card taken out of its place to be carried or flown keeps its size by
// taking this with it.
export const cardScaleOf = (el) => {
    const value = el && parseFloat(getComputedStyle(el).getPropertyValue('--card-scale'));
    return Number.isFinite(value) && value > 0 ? value : undefined;
};

export const cardWidth = 'calc(var(--card-scale, 1) * 4rem)';
export const cardHeight = 'calc(var(--card-scale, 1) * 5.6rem)';

const imageSizes = {
    sm: 0.6,
    md: 1,
    lg: 1.4,
    xl: 2,
    '2xl': 3,
    '3xl': 4,
    '4xl': 5,
    small: 0.6,
    normal: 1,
    large: 1.4,
    'x-large': 2,
    '2x-large': 3,
    '3x-large': 4,
    '4x-large': 5
};

export const resolveImageScale = (size) => imageSizes[size] ?? 1;
