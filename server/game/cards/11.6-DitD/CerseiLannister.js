const DrawCard = require('../../drawcard');

class CerseiLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) =>
                    event.card.controller === this.controller &&
                    this.game.currentPhase === 'challenge'
            },
            limit: ability.limit.perPhase(3),
            handler: (context) => {
                for (let opponent of this.game.getOpponents(context.player)) {
                    opponent.discardAtRandom(1);
                }

                this.game.addMessage(
                    "{0} uses {1} to discard 1 card at random from each opponent's hand",
                    context.player,
                    this
                );
            }
        });
    }
}

CerseiLannister.code = '11109';

module.exports = CerseiLannister;
