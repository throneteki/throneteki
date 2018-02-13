const DrawCard = require('../../drawcard.js');

class HightowerSpy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            handler: context => {
                let topCard = this.controller.drawDeck.first();
                let increase = topCard.getCost();

                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(increase)
                }));

                this.game.addMessage('{0} uses {1} to reveal {2} and give {3} +{4} STR until the end of the phase',
                    context.player, this, topCard, context.target, increase);
            }
        });
    }
}

HightowerSpy.code = '08063';

module.exports = HightowerSpy;
