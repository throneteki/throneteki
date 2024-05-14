const DrawCard = require('../../drawcard.js');

class AttackFromTheMountains extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.hasAttackingClansman()
            },
            target: {
                cardCondition: (card) =>
                    card.owner === this.controller &&
                    card.location === 'hand' &&
                    card.hasTrait('Clansman') &&
                    card.getType() === 'character' &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.target.owner.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} plays {1} to put {2} into play from their hand',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }

    hasAttackingClansman() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() && card.hasTrait('Clansman') && card.getType() === 'character'
        );
    }
}

AttackFromTheMountains.code = '06010';

module.exports = AttackFromTheMountains;
