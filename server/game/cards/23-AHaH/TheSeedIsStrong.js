const DrawCard = require('../../drawcard.js');

class TheSeedIsStrong extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onInitiativeDetermined: event => event.winner !== this.controller && this.controller.anyCardsInPlay(card => (card.getType() === 'character' && card.hasTrait('House Arryn')) || card.name === 'Stannis Baratheon')
            },
            message: {
                format: '{player} uses {source} to have {winner} discard a Lord or Lady from their hand or shadows area, or reveal their hand and shadows area',
                args: { winner: context => context.event.winner }
            },
            handler: context => {
                if(context.event.winner.hand.some(card => this.isLordOrLady(card)) || context.event.winner.shadows.some(card => this.isLordOrLady(card))) {
                    this.promptForCardDiscard(context);
                    return;
                }

                this.revealHandAndShadows(context);
            }
        });
    }

    promptForCardDiscard(context) {
        this.game.promptForSelect(context.event.winner, {
            source: this,
            cardCondition: { location: ['hand', 'shadows'], trait: ['Lord', 'Lady'], controller: context.event.winner },
            onSelect: (player, card) => this.onCardSelected(context, player, card),
            onCancel: player => this.onCancel(player)
        });
    }

    onCardSelected(context, player, card) {
        player.discardCard(card);
        this.game.addMessage('{0} uses {1} to have {2} discard {3} from their {4}',
            context.player, this, context.event.winner, card, card.location);

        return true;
    }

    onCancel(player) {
        this.game.addAlert('danger', '{0} did not select a card to discard for {1}',
            player, this);

        return true;
    }

    revealHandAndShadows(context) {
        this.game.addMessage('{0} uses {1} to have {2} reveal {3} as their hand and {4} as their shadows area',
            context.player, this, context.event.winner, context.event.winner.hand, context.event.winner.shadows);
    }

    isLordOrLady(card) {
        return card.isMatch({ trait: ['Lord', 'Lady']});
    }
}

TheSeedIsStrong.code = '23037';

module.exports = TheSeedIsStrong;
