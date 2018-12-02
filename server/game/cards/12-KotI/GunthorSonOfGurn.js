const DrawCard = require('../../drawcard.js');

class GunthorSonOfGurn extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.winner === this.controller &&
                    this.isAttacking()
                )
            },
            handler: context => {
                this.game.promptForSelect(context.opponent, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    cardCondition: card => card.location === 'hand' && card.controller === context.opponent,
                    onSelect: (player, card) => this.cardSelected(context, player, card)
                });
            }
        });
    }

    onCardSelected(context, player, card) {
        player.discardCard(card);
        this.game.addMessage('{0} uses {1} to have {2} discard {3} from their hand',
            context.player, this, context.opponent, card);

        return true;
    }
}

GunthorSonOfGurn.code = '12027';

module.exports = GunthorSonOfGurn;
