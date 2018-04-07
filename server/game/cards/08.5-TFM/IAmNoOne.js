const DrawCard = require('../../drawcard.js');
const _ = require('underscore');

class IAmNoOne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character stealth/insight',
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                                       card.getPrintedCost() <= 3 && card.controller === this.controller
            },
            handler: context => {
                let effectArr = _.flatten([
                    context.target.getFactions().map(faction => ability.effects.removeFaction(faction)),
                    context.target.getTraits().map(trait => ability.effects.removeTrait(trait)),
                    ability.effects.addKeyword('stealth'),
                    ability.effects.addKeyword('insight'),
                    ability.effects.doesNotKneelAsAttacker()
                ]);

                this.untilEndOfPhase(() => ({
                    match: context.target,
                    effect: effectArr
                }));

                this.game.addMessage('{0} plays {1} and chooses {2} as its target',
                    context.player, this, context.target);
            }
        });
    }
}

IAmNoOne.code = '08082';

module.exports = IAmNoOne;
