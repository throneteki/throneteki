const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class RaventreeHall extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: event => this.isCharacter(event.card),
                onCardPowerMoved: event => this.isCharacter(event.target)
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold(context => ({ player: context.player, amount: 1 }))
        });
    }

    isCharacter(card) {
        return card.getType() === 'character' && card.controller === this.controller;
    }
}

RaventreeHall.code = '25567';
RaventreeHall.version = '1.0';

module.exports = RaventreeHall;
