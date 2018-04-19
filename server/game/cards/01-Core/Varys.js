const DrawCard = require('../../drawcard.js');

class Varys extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: event => event.phase === 'dominance'
            },
            cost: ability.costs.removeSelfFromGame(),
            handler: () => {
                for(const player of this.game.getPlayers()) {
                    let characters = player.filterCardsInPlay(card => card.getType() === 'character');
                    for(const card of characters) {
                        player.discardCard(card);
                    }
                }

                this.game.addMessage('{0} removes {1} from the game to discard all characters',
                    this.controller, this);
            }
        });
    }
}

Varys.code = '01029';

module.exports = Varys;
