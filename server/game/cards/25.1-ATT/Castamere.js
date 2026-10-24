import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Castamere extends DrawCard {
    // Castamere (25006)
    // Reaction: After claim is applied for an [intrigue] challenge you won by 5 or more STR, kneel
    // and sacrifice Castamere to apply [military] claim.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.challenge.isMatch({
                        winner: context.source.controller,
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
                return { player: context.player, claim, game: context.game };
            })
        });
    }
}

Castamere.code = '25006';

export default Castamere;
