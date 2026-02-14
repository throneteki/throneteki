import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class DarkandFullofTerrors extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place character in shadows',
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.hasTrait("R'hllor") && card.getType() === 'character'
                ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 3 &&
                    card.kneeled
            },
            message: '{player} plays {source} to put {target} into shadow',
            handler: (context) => {
                context.player.putIntoShadows(context.target, true, () => {
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

DarkandFullofTerrors.code = '20003';

export default DarkandFullofTerrors;
