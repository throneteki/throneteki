const DrawCard = require('../../drawcard.js');
const Conditions = require('../../Conditions');
const GameActions = require('../../GameActions');

class BearIslandScout extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal' && Conditions.allCharactersAreStark({ player: this.controller })
            },
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { trait: 'House Mormont' },
                message: '{player} uses {source} to search their deck and add {searchTarget} to their hand',
                cancelMessage: '{player} uses {source} to search their deck but does not find a card',
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BearIslandScout.code = '11081';

module.exports = BearIslandScout;
