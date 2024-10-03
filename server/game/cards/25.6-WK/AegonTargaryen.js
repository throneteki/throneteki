import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class AegonTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    this.game.currentPhase === 'challenge' &&
                    event.card.isMatch({ type: 'character', loyal: false, faction: 'targaryen' })
            },
            limit: ability.limit.perPhase(2),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

AegonTargaryen.code = '25113';

export default AegonTargaryen;
