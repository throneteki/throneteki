const DrawCard = require('../../../drawcard.js');

class UnswornApprentice extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain icon',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            handler: context => {
                this.game.promptForIcon(this.controller, context);

                this.game.queueSimpleStep(() => {
                    this.untilEndOfPhase(ability => ({
                        match: this,
                        effect: ability.effects.addIcon(context.icon)
                    }));

                    this.game.addMessage('{0} uses {1} to have {1} gain {2} {3} icon until the end of the phase',
                                        this.controller, this, context.icon === 'intrigue' ? 'an' : 'a', context.icon);
                });
            }
        });
    }
}

UnswornApprentice.code = '02025';

module.exports = UnswornApprentice;
