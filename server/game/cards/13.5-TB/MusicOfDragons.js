const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class MusicOfDragons extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search deck',
            phase: 'challenge',
            message: '{player} plays {source} to search their deck for a Dragon character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Dragon' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

MusicOfDragons.code = '13094';

module.exports = MusicOfDragons;
