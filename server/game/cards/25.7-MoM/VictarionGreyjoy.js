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
                    effects.push(ability.effects.cannotBeKneeled(context => context.resolutionStage === 'effect'));
                    bonusMessage.push('insight and cannot be knelt by card effects');
                }
                
                if(context.costs.kneel.hasTrait('Drowned God')) {
                    effects.push(ability.effects.addKeyword('renown'));
                    effects.push(ability.effects.cannotBeKilled());
                    if(bonusMessage.length === 1) {
                        bonusMessage.push(' and ');
                    }
                    bonusMessage.push('renown and cannot be killed');
                }

                this.untilEndOfPhase(() => ({
                    match: this,
                    effect: effects
                }));
                this.game.addMessage('{0} uses {1} to have {1} gain {2}', this.controller, this, bonusMessage);
            }
        });
    }
}

VictarionGreyjoy.code = '25515';
VictarionGreyjoy.version = '1.0';

module.exports = VictarionGreyjoy;
