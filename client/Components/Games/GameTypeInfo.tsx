export const GameTypeDescriptions = {
    beginner: 'New to the game or the site. Expect slow turns and rules mistakes.',
    casual: 'Relaxed, like playing a friend. Take-backs and breaks are fine.',
    competitive: 'Tournament standard. Play promptly, with no long breaks.'
};

const GameTypeInfo = ({ gameType, className }) => {
    const description = GameTypeDescriptions[gameType];

    return description ? <p className={className}>{description}</p> : null;
};

export default GameTypeInfo;
