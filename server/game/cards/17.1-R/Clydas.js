const DrawCard = require('../../drawcard.js');

class Clydas extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold to your gold pool',
            chooseOpponent: (opponent) => opponent.gold > 0,
            message:
                "{player} uses {source} to move 1 gold from {opponent}'s gold pool to their own",
            limit: ability.limit.perRound(2),
            cost: ability.costs.kneel((card) => card === this || card.hasTrait('Raven')),
            handler: (context) => {
                this.game.transferGold({ from: context.opponent, to: context.player, amount: 1 });
            }
        });
    }
}

Clydas.code = '17117';

module.exports = Clydas;
