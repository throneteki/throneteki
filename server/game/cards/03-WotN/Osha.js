import DrawCard from '../../drawcard.js';

class Osha extends DrawCard {
    // Osha (03011)
    // Challenges Action: Remove Osha from the challenge. Then, stand her. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove Osha from the challenge and stand her',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            condition: () => this.isParticipating(),
            handler: (context) => {
                this.game.currentChallenge.removeFromChallenge(this);
                this.controller.standCard(this);
                this.game.addMessage(
                    '{0} removes {1} from the challenge and stands her',
                    context.player,
                    this
                );
            }
        });
    }
}

Osha.code = '03011';

export default Osha;
