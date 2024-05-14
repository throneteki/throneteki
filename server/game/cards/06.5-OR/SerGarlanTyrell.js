import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SerGarlanTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold])
        });

        this.action({
            title: 'Give character +2 STR',
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isFaction('tyrell') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }));
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to give {2} +2 STR until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

SerGarlanTyrell.code = '06083';

export default SerGarlanTyrell;
