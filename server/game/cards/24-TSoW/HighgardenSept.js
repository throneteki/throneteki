const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class HighgardenCastleSept extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.hand.length >= 7,
            targetController: 'any',
            effect: ability.effects.cannotPutIntoPlay((card, playingType) => !card.hasTrait('The Seven') && playingType !== 'marshal')
        });
        this.reaction({
            when: {
                onCardPowerGained: event => this.isControlledCharacter(event.card),
                onCardPowerMoved: event => this.isControlledCharacter(event.target)
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards(context => ({ amount: 1, player: context.player, source: this }))
        });
    }

    isControlledCharacter(card) {
        return card.getType() === 'character' && card.controller === this.controller;
    }
}

HighgardenCastleSept.code = '24024';

module.exports = HighgardenCastleSept;
