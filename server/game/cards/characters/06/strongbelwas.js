const DrawCard = require('../../../drawcard.js');

class StrongBelwas extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select character to save',
                cardCondition: (card, context) => context.event.cards.includes(card) && card.controller === this.controller &&
                                                  card !== this && card.isUnique() && card.isFaction('targaryen')
            },
            handler: context => {
                context.event.saveCard(context.target);
                this.game.addMessage('{0} discards 1 gold from {1} to save {2}', this.controller, this, context.target);
            }
        });
    }
}

StrongBelwas.code = '06073';

module.exports = StrongBelwas;
