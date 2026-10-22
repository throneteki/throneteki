import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheRegentsCouncil extends DrawCard {
    // The Regent's Council (26046)
    // Reaction: After you win an [intrigue] challenge in which you control a participating Small
    // Council character or Cersei Lannister, determine dominance. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === context.player &&
                    event.challenge
                        .getParticipants()
                        .some(
                            (card) =>
                                card.controller === context.player &&
                                (card.hasTrait('Small Council') || card.name === 'Cersei Lannister')
                        )
            },
            max: ability.limit.perPhase(1),
            message: '{player} plays {source} to determine dominance',
            gameAction: GameActions.determineDominance()
        });
    }
}

TheRegentsCouncil.code = '26046';

export default TheRegentsCouncil;
