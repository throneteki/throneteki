import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DragonSight extends DrawCard {
    // Dragon Sight (03036)
    // Action: Each participating non-Dragon character gets -1 STR until the end of the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce non-Dragon characters STR by 1',
            message:
                '{player} uses {source} to give each non-Dragon participating character -1 STR until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.game.filterCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        !card.hasTrait('Dragon') &&
                        card.isParticipating()
                ),
                targetController: 'any',
                effect: ability.effects.modifyStrength(-1)
            }))
        });
    }
}

DragonSight.code = '03036';

export default DragonSight;
