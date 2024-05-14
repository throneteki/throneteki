const DrawCard = require('../../drawcard.js');

class Varys extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'dominance' &&
                    this.game.anyCardsInPlay(
                        (card) => card.getType() === 'character' && card !== this
                    )
            },
            cost: ability.costs.removeSelfFromGame(),
            handler: () => {
                let characters = this.game.filterCardsInPlay(
                    (card) => card.getType() === 'character'
                );
                this.game.discardFromPlay(characters);

                this.game.addMessage(
                    '{0} removes {1} from the game to discard all characters',
                    this.controller,
                    this
                );
            }
        });
    }
}

Varys.code = '01029';

module.exports = Varys;
