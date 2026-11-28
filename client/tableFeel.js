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

// The table is seen from above, so a card held up off it is closer to the viewer and drawn larger. Every
// card on the board lies on the table; a card being carried, or moving between zones, is held up.
// React adds px to a number given as the `scale` style, so give these to React styles as strings.
export const elevation = { table: 1, carried: 1.1 };

export const sizeAt = (source) => elevation[source] ?? elevation.table;

// A moving card starts where it was: on the table unless it was already being carried
const pickedUp = (uuid, fromSource) => ({
    scale: sizeAt(fromSource),
    rotate: `${fromSource === 'carried' ? 0 : restingAngle(uuid, fromSource)}deg`,
    shadow: fromSource === 'carried' ? 1 : 0
});

export const landingImpact = (toSource) => (toSource === 'play area' ? 0.97 : 0.985);

// Keyframes in linear time: picked up and tilted while travelling, a small dip as it is put down, then at rest
export const liftFrames = ({ uuid, toSource, fromSource }) => {
    const tilt = seededAngle(uuid, maxTilt);
    const rest = `${restingAngle(uuid, toSource)}deg`;
    const start = pickedUp(uuid, fromSource);

    return {
        rest,
        card: [
            { scale: start.scale, rotate: start.rotate, offset: 0 },
            { scale: elevation.carried, rotate: `${tilt}deg`, offset: 0.25, easing: 'ease-out' },
            {
                scale: elevation.carried,
                rotate: `${tilt * 0.5}deg`,
                offset: 0.4,
                easing: 'ease-in'
            },
            { scale: landingImpact(toSource), rotate: rest, offset: 0.65 },
            { scale: 1, rotate: rest, offset: 0.82 },
            { scale: 1, rotate: rest, offset: 1 }
        ],
        lift: [
            { opacity: start.shadow, offset: 0 },
            { opacity: 1, offset: 0.25 },
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
    !['hand', 'shadows', 'attached', 'duplicate'].includes(toSource);

const slapTilt = (uuid) => {
    const angle = seededAngle(uuid, 3.5);
    return Math.abs(angle) >= 1.5 ? angle : angle < 0 ? -1.5 : 1.5;
};

// The table is seen from above, so a bounce is the card rising towards the viewer (growing) and settling back
export const slapFrames = ({ uuid, toSource, fromSource, config = slapConfig }) => {
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

    const start = pickedUp(uuid, fromSource);
    const raised = (config.move * 0.35) / total;

    const card = [
        frame(0, start.scale, start.rotate, 'ease-out'),
        frame(raised, elevation.carried, deg(tilt), 'ease-in'),
        frame(config.move / total, 1, deg(tilt), 'ease-out'),
        frame(at(0.3), hardness, deg(tilt * 0.8), 'ease-in'),
        frame(at(0.6), 1, deg(tilt * 0.15), 'ease-out'),
        frame(at(0.8), 1.015, rest, 'ease-in'),
        frame(1, 1, rest)
    ];
    const lift = [
        { opacity: start.shadow, offset: 0 },
        { opacity: 1, offset: raised },
        { opacity: 1, offset: config.move / total },
        { opacity: 0, offset: config.move / total + 0.04 },
        { opacity: 0.5, offset: at(0.3), easing: 'ease-in' },
        { opacity: 0, offset: at(0.6) },
        { opacity: 0, offset: 1 }
    ];

    return { card, lift, total, rest };
};
