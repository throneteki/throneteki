import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VengefulLordling extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                afterChallenge: (event) =>
                    this.isParticipating() && event.challenge.isMatch({ loser: this.controller })
            },
            message:
                '{player} uses {source} to reduce the cost of the next card they ambush or bring out of shadows this phase by 1',
            gameAction: GameActions.genericHandler(() => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.reduceNextAmbushedOrOutOfShadowsCardCost(1)
                }));
            })
        });
    }
}

VengefulLordling.code = '00194';

export default VengefulLordling;
