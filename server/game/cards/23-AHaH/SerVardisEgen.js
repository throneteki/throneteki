import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SerVardisEgen extends DrawCard {
    // Ser Vardis Egen (23026)
    // Reaction: After you lose a challenge in which Ser Vardis Egen is defending, sacrifice him to
    // choose an attacking character. Place it in shadows with a shadow token on it (cannot be
    // saved). While that card is in shadows, it gains shadow (X). X is its printed cost.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.isDefending() && event.challenge.isMatch({ loser: this.controller })
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: { type: 'character', attacking: true }
            },
            message: '{player} sacrifices {source} to put {target} into shadows',
            handler: (context) => {
                context.player.putIntoShadows(context.target, false, () => {
                    context.target.modifyToken(Tokens.shadow, 1);

                    this.lastingEffect((ability) => ({
                        condition: () => context.target.location === 'shadows',
                        targetLocation: 'any',
                        match: context.target,
                        effect: ability.effects.addKeyword(
                            `Shadow (${context.target.translateXValue(context.target.getPrintedCost())})`
                        )
                    }));
                });
            }
        });
    }
}

SerVardisEgen.code = '23026';

export default SerVardisEgen;
