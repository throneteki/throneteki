import DrawCard from '../../drawcard.js';

class CerseiLannister extends DrawCard {
    // Cersei Lannister (11109)
    // Shadow (5).
    // Reaction: After a card you control comes out of shadows during the challenges phase, each
    // opponent discards 1 card at random from his or her hand. (Limit 3 times per phase.)
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

export default CerseiLannister;
