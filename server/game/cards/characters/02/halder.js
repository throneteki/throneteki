const DrawCard = require('../../../drawcard.js');

class Halder extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a location or attachment',
            cost: ability.costs.kneel(card => (
                card.getFaction() === 'thenightswatch' &&
                (card.getType() === 'attachment' || card.getType() === 'location')
            )),
            handler: (player, arg, context) => {
                this.game.promptForSelect(player, {
                    cardCondition: card => card.getFaction() === 'thenightswatch' && card.getType() === 'character',
                    activePromptTitle: 'Select character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    onSelect: (player, card) => this.onStrCardSelected(player, card, context.kneelingCostCard)
                });
            }
        });
    }

    onStrCardSelected(player, card, kneelingCard) {
        this.game.addMessage('{0} uses {1} to kneels {2} to give {3} +1 STR until the end of the phase', player, this, kneelingCard, card);

        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(1)
        }));

        return true;
    }
}

Halder.code = '02065';

module.exports = Halder;
