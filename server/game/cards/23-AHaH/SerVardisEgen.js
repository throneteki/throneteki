import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SerVardisEgen extends DrawCard {
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
                            `Shadow (${context.target.getPrintedCost()})`
                        )
                    }));
                });
            }
        });
    }
}

SerVardisEgen.code = '23026';

export default SerVardisEgen;
