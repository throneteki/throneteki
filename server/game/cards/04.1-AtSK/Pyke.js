const DrawCard = require('../../drawcard.js');

class Pyke extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character stealth',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to have {2} gain stealth until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );

                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('Stealth')
                }));
            }
        });
    }
}

Pyke.code = '04013';

module.exports = Pyke;
