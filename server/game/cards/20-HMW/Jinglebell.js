const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Jinglebell extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            gameAction: GameActions.search({
                title: 'Select a card',
                match: {
                    type: 'character',
                    condition: card => card.getTraits().some(trait => this.hasTrait(trait))
                },
                message: '{player} uses {source} to search their deck and add {searchTarget} to their hand',
                cancelMessage: '{player} uses {source} to search their deck but does not find a card',
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Jinglebell.code = '20046';

module.exports = Jinglebell;
