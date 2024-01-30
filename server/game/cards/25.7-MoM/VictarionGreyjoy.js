const DrawCard = require('../../drawcard.js');

class VictarionGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.kneel((card) => card.getType() === 'character'),
            handler: context => {
                let bonusMessage = [];
                let effects = [];

                if(context.costs.kneel.hasTrait('R\'hllor')) {
                    effects.push(ability.effects.addKeyword('insight'));
                    effects.push(ability.effects.immuneTo(card => card.controller !== this.controller && card.getType() === 'character'));
                    bonusMessage.push('insight');
                    bonusMessage.push('immunity to opponent\'s character abilities');
                }
                
                if(context.costs.kneel.hasTrait('Drowned God')) {
                    effects.push(ability.effects.addKeyword('renown'));
                    effects.push(ability.effects.cannotBeKilled());
                    bonusMessage.push('renown');
                    bonusMessage.push('cannot be killed');
                }

                this.untilEndOfPhase(() => ({
                    match: this,
                    effect: effects
                }));
                this.game.addMessage('{0} uses {1} to have {1} gain {2} until the end of the phase', this.controller, this, bonusMessage);
            }
        });
    }
}

VictarionGreyjoy.code = '25515';
VictarionGreyjoy.version = '1.2';

module.exports = VictarionGreyjoy;
