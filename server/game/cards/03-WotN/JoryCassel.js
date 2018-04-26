const DrawCard = require('../../drawcard.js');

class JoryCassel extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) => (
                    card.location === 'play area' &&
                    context.event.cards.includes(card) &&
                    card.canBeSaved() &&
                    card.controller === this.controller &&
                    card.isUnique() &&
                    card.isFaction('stark')
                )
            },
            handler: context => {
                let message = '{0} sacrifices {1} to save {2}';
                let toKill = context.target;

                context.event.saveCard(toKill);

                if(this.game.getPlayers().some(player => {
                    return player.activePlot.hasTrait('Winter');
                }) && toKill.canGainPower()) {
                    toKill.modifyPower(1);
                    message += ' and have it gain 1 power';
                }

                this.game.addMessage(message, this.controller, this, toKill);
            }
        });
    }
}

JoryCassel.code = '03008';

module.exports = JoryCassel;
