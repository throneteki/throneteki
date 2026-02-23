import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class HotPie extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bake a Pie',
            cost: ability.costs.kneelSelf(),
            phase: 'marshal',
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            message: '{player} kneels {source} to bake a pie for {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: context.target, token: Tokens.pie })),
                    context
                );
                this.lastingEffect((ability) => ({
                    targetLocation: 'play area',
                    targetController: 'any',
                    match: context.target,
                    effect: ability.effects.modifyStrength(1)
                }));
            }
        });
    }
}

HotPie.code = '00361';

export default HotPie;
