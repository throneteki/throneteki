const DrawCard = require('../../drawcard.js');

class Clydas extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold to your gold pool',
            chooseOpponent: (opponent) => opponent.gold > 0,
            message:
                "{player} uses {source} to move 1 gold from {opponent}'s gold pool to their own",
            handler: (context) => {
                this.game.transferGold({ from: context.opponent, to: context.player, amount: 1 });
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

Clydas.code = '15033';

module.exports = Clydas;
