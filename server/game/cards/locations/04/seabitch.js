const DrawCard = require('../../../drawcard.js');

class SeaBitch extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of location',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) => this.cardCondition(card, context)
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.takeControl(context.player)
                }));

                this.game.addMessage('{0} sacrifices {1} to take control of {2} until the end of the phase',
                                      context.player, this, context.target);
            }
        });
    }

    cardCondition(card, context) {
        return card.getType() === 'location'
            && card.location === 'play area'
            && card.controller !== context.player
            && !card.hasKeyword('Limited')
            && card.name !== this.name;
    }
}

SeaBitch.code = '04112';

module.exports = SeaBitch;
