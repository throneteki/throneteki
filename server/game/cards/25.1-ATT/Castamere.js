import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Castamere extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.isMatch({
                        winner: this.controller,
                        challengeType: 'intrigue',
                        by5: true
                    })
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message:
                '{player} kneels and sacrifices {costs.sacrifice} to also apply military claim',
            gameAction: GameActions.applyClaim((context) => {
                const claim = context.event.claim.clone();
                claim.challengeType = 'military';
                return { player: context.player, claim, game: this.game };
            })
        });
    }
}

Castamere.code = '25006';

export default Castamere;
