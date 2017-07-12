const DrawCard = require('../../../drawcard.js');

class BreakerOfChains extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.getSTRBoost())
        });

        this.reaction({
            when: {
                onAttackersDeclared: event => event.challenge.isAttacking(this.parent)
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'hand' && card.controller === this.controller &&
                                       card.getCost() <= 2
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

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('targaryen') || !card.isUnique()) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

BreakerOfChains.code = '06074';

module.exports = BreakerOfChains;
