const DrawCard = require('../../drawcard.js');
const Conditions = require('../../Conditions');
const GameActions = require('../../GameActions');

class BearIslandScout extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card === this &&
                    event.playingType === 'marshal' &&
                    Conditions.allCharactersAreStark({ player: this.controller })
            },
            message: '{player} uses {source} to search their deck for a House Mormont card',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { trait: 'House Mormont' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BearIslandScout.code = '11081';

module.exports = BearIslandScout;
