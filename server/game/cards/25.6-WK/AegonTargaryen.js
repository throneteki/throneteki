import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class AegonTargaryen extends DrawCard {
    // Aegon Targaryen (25113)
    // Renown. Shadow (6).
    // Reaction: After a non-loyal [targaryen] character enters play during the challenges phase,
    // stand Aegon Targaryen. (Limit twice per phase.)
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
