const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class MothersMen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    !this.game.claim.isApplying &&
                    event.card.controller !== context.player &&
                    context.player.canPutIntoPlay(this)
            },
            location: 'discard pile',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: this
            })),
            message: '{player} puts {source} into play from their discard pile'
        });
    }
}

MothersMen.code = '21020';

module.exports = MothersMen;
