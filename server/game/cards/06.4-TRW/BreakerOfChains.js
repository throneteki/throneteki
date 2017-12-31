const DrawCard = require('../../drawcard.js');

class BreakerOfChains extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen', unique: true });

        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.getSTRBoost())
        });

        this.reaction({
            when: {
                onAttackersDeclared: event => event.challenge.isAttacking(this.parent)
            },
            target: {
                cardCondition: card =>
                    card.location === 'hand'
                    && card.controller === this.controller
                    && card.getType() === 'character'
                    && card.getCost() <= 2
                    && this.controller.canPutIntoPlay(card)
            },
            handler: context => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, context.target);
            }
        });
    }

    getSTRBoost() {
        return this.controller.getNumberOfCardsInPlay(card => card.getType() === 'character' && card.getCost() <= 2);
    }
}

BreakerOfChains.code = '06074';

module.exports = BreakerOfChains;
