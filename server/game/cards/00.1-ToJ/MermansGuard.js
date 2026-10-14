import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MermansGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) => event.card === this,
                onDeclaredAsDefender: (event) => event.card === this
            },
            cost: [ability.costs.kneelFactionCard(), ability.costs.discardGold()],
            target: {
                cardCondition: (card) =>
                    card.isUnique() &&
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.allowGameAction('stand')
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({ card: context.target })),
                    context
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('renown')
                }));
                this.game.addMessage(
                    '{0} uses {1} to stand {2} and have it gain renown',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

MermansGuard.code = '00239';

export default MermansGuard;
