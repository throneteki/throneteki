const JoustFormat = {
    name: 'joust',
    requiredDraw: 60,
    requiredPlots: 7,
    maxDoubledPlots: 1,
    cannotInclude: card => card.packCode === 'VDS',
    rules: [
        {
            message: 'You cannot include Draft cards in a normal deck',
            condition: deck => {
                return deck.getUniqueCards().every(card => card.packCode !== 'VDS');
            }
        }
    ]
};

export default JoustFormat;
