import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SerEmmonCuy extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event) => event.challenge.attackingPlayer === this.controller
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            handler: () => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage(
                    '{0} discards 1 gold from {1} to raise their claim value until the end of the challenge',
                    this.controller,
                    this
                );

                if (this.canBeKilled() && !this.hasToken(Tokens.gold)) {
                    this.game.killCharacter(this);
                    this.game.addMessage('{0} then kills {1}', this.controller, this);
                }
            }
        });
    }
}

SerEmmonCuy.code = '18016';

export default SerEmmonCuy;
