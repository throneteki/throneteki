const DrawCard = require('../../drawcard.js');

class Dareon extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event) =>
                    event.card.hasTrait('Song') && event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            chooseOpponent: (opponent) => opponent.gold >= 1,
            handler: (context) => {
                this.game.transferGold({ from: context.opponent, to: this.controller, amount: 1 });
                this.game.addMessage(
                    "{0} uses {1} to move 1 gold from {2}'s gold pool to their own",
                    this.controller,
                    this,
                    context.opponent
                );
            }
        });
    }
}

Dareon.code = '08025';

module.exports = Dareon;
