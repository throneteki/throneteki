// Cards behave like physical cards on a table: they are lifted while they travel and land with a small settle

const looseSources = ['discard pile', 'dead pile'];
const maxTilt = 2;
const maxLoose = 1.5;

const hash = (text = '') => {
    let value = 0;
    for (let index = 0; index < text.length; index++) {
        value = (value * 31 + text.charCodeAt(index)) >>> 0;
    }
    return value;
};

// The same card always gets the same angle, so nothing shifts when it is drawn again
export const seededAngle = (seed, max) =>
    Math.round((((hash(seed) % 2001) - 1000) / 1000) * max * 100) / 100;

// Cards in a discard or dead pile rest slightly askew, like a loosely stacked pile
export const restingAngle = (uuid, source) =>
    looseSources.includes(source) ? seededAngle(uuid, maxLoose) : 0;

export const landingImpact = (toSource) => (toSource === 'play area' ? 0.97 : 0.985);

// Keyframes in linear time: lifted and tilted while travelling, a small dip as it lands, then at rest
export const liftFrames = ({ uuid, toSource }) => {
    const tilt = seededAngle(uuid, maxTilt);
    const rest = `${restingAngle(uuid, toSource)}deg`;
    const impact = landingImpact(toSource);

    return {
        rest,
        card: [
            { scale: 1.06, rotate: `${tilt}deg`, offset: 0 },
            { scale: 1.04, rotate: `${tilt * 0.5}deg`, offset: 0.45 },
            { scale: impact, rotate: rest, offset: 0.62 },
            { scale: 1, rotate: rest, offset: 0.8 },
            { scale: 1, rotate: rest, offset: 1 }
        ],
        lift: [
            { opacity: 1, offset: 0 },
            { opacity: 1, offset: 0.45 },
            { opacity: 0, offset: 0.65 },
            { opacity: 0, offset: 1 }
        ]
    };
};

// Cards that land on the table slap down: a fast move that stops suddenly, then a bounce that settles
export const slapConfig = { move: 230, settle: 300, easing: 'cubic-bezier(0.55, 0, 0.9, 0.45)' };

export const slapsInto = (toSource) =>
    toSource !== undefined &&
    toSource !== null &&
    !['hand', 'shadows', 'attached'].includes(toSource);

const slapTilt = (uuid) => {
    const angle = seededAngle(uuid, 3.5);
    return Math.abs(angle) >= 1.5 ? angle : angle < 0 ? -1.5 : 1.5;
};

// The table is seen from above, so a bounce is the card rising towards the viewer (growing) and settling back
export const slapFrames = ({ uuid, toSource, config = slapConfig }) => {
    const total = config.move + config.settle;
    const at = (share) => (config.move + share * config.settle) / total;
    const tilt = slapTilt(uuid);
    const rest = `${restingAngle(uuid, toSource)}deg`;
    const hardness = toSource === 'play area' ? 1.07 : 1.05;
    const deg = (value) => `${value}deg`;
    const frame = (offset, scale, rotate, easing) => ({
        offset,
        scale,
        rotate,
        ...(easing && { easing })
    });

    const card = [
        frame(0, 1.08, deg(tilt)),
        frame(config.move / total, 1, deg(tilt), 'ease-out'),
        frame(at(0.3), hardness, deg(tilt * 0.8), 'ease-in'),
        frame(at(0.6), 1, deg(tilt * 0.15), 'ease-out'),
        frame(at(0.8), 1.015, rest, 'ease-in'),
        frame(1, 1, rest)
    ];
    const lift = [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: config.move / total },
        { opacity: 0, offset: config.move / total + 0.04 },
        { opacity: 0.5, offset: at(0.3), easing: 'ease-in' },
        { opacity: 0, offset: at(0.6) },
        { opacity: 0, offset: 1 }
    ];

    return { card, lift, total, rest };
};
