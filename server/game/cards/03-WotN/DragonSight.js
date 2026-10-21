import DrawCard from '../../drawcard.js';

class DragonSight extends DrawCard {
    // Dragon Sight (03036)
    // Action: Each participating non-Dragon character gets -1 STR until the end of the challenge.
    setupCardAbilities() {
        this.action({
            title: 'Reduce non-Dragon characters STR by 1',
            handler: () => {
                let participatingChars = this.game.filterCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        !card.hasTrait('Dragon') &&
                        card.isParticipating()
                );

                this.game.addMessage(
                    '{0} uses {1} to give each non-Dragon participating character -1 STR until the end of the challenge',
                    this.controller,
                    this
                );
                this.untilEndOfChallenge((ability) => ({
                    match: participatingChars,
                    targetController: 'any',
                    effect: ability.effects.modifyStrength(-1)
                }));
            }
        });
    }
}

DragonSight.code = '03036';

export default DragonSight;
