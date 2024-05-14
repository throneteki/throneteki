const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class FreeBrothers extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message:
                '{player} uses {source} to search their deck for an Ally character with printed cost 3 or lower',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { trait: 'Ally', printedCostOrLower: 3 },
                reveal: false,
                message: '{player} places {searchTarget} in their discard pile',
                gameAction: GameActions.placeCard((context) => ({
                    card: context.searchTarget,
                    player: context.player,
                    location: 'discard pile'
                }))
            })
        });
    }
}

FreeBrothers.code = '25013';

module.exports = FreeBrothers;
