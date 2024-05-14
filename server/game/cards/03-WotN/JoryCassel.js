const DrawCard = require('../../drawcard.js');

class JoryCassel extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === this.controller &&
                    event.card.isUnique() &&
                    event.card.isFaction('stark')
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                let message = '{0} uses {1} to save {2}';
                let toKill = context.event.card;

                context.event.saveCard();

                if (toKill.canGainPower() && this.game.anyPlotHasTrait('Winter')) {
                    toKill.modifyPower(1);
                    message += ' and have it gain 1 power';
                }

                this.game.addMessage(message, context.player, this, toKill);
            }
        });
    }
}

JoryCassel.code = '03008';

module.exports = JoryCassel;
