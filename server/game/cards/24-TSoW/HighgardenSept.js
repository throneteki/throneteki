const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class HighgardenSept extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.hand.length >= 7,
            targetController: 'any',
            effect: ability.effects.cannotPutIntoPlay((card, playingType) => card.getType() === 'character' && !card.hasTrait('The Seven') && playingType !== 'marshal')
        });
        this.reaction({
            when: {
                onCardPowerGained: event => this.isValidCard(event.card),
                onCardPowerMoved: event => this.isValidCard(event.target)
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards(context => ({ amount: 1, player: context.player, source: this }))
        });
    }

    isValidCard(card) {
        return card.hasTrait('The Seven') && card.controller === this.controller;
    }
}

HighgardenSept.code = '24024';

module.exports = HighgardenSept;
