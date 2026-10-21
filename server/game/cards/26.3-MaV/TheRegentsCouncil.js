import DrawCard from '../../drawcard.js';
import DetermineDominance from '../../gamesteps/DetermineDominance.js';

class TheRegentsCouncil extends DrawCard {
    // The Regent's Council (26046)
    // Reaction: After you win an [intrigue] challenge in which you control a participating Small
    // Council character or Cersei Lannister, determine dominance. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'intrigue' &&
                    this.controller.anyCardsInPlay(
                        (card) =>
                            card.isParticipating() &&
                            (card.hasTrait('Small Council') || card.name === 'Cersei Lannister')
                    )
            },
            max: ability.limit.perPhase(1),
            message: '{player} plays {source} to determine dominance',
            handler: () => {
                this.game.queueStep(new DetermineDominance(this.game, this));
            }
        });
    }
}

TheRegentsCouncil.code = '26046';

export default TheRegentsCouncil;
