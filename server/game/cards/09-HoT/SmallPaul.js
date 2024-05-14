const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class SmallPaul extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this
            },
            message: {
                format: '{player} uses {source} to search the top {reserve} cards of their deck for any number of Steward characters',
                args: { reserve: () => this.controller.getTotalReserve() }
            },
            gameAction: GameActions.search({
                title: 'Select any number of characters',
                numToSelect: (context) => context.player.getTotalReserve(),
                topCards: (context) => context.player.getTotalReserve(),
                match: { type: 'character', trait: 'Steward' },
                message: '{player} adds {searchTarget} to their hand',
                gameAction: GameActions.simultaneously((context) =>
                    context.searchTarget.map((card) => GameActions.addToHand({ card }))
                )
            })
        });
    }
}

SmallPaul.code = '09033';

module.exports = SmallPaul;
