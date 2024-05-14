const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class AntlerMen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerMoved: (event) =>
                    event.target.getType() === 'faction' &&
                    event.target.controller === this.controller
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

AntlerMen.code = '22002';

module.exports = AntlerMen;
