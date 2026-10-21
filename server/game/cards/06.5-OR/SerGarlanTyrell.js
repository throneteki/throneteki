import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SerGarlanTyrell extends DrawCard {
    // Ser Garlan Tyrell (06083)
    // Bestow (3). Renown.
    // Ser Garlan Tyrell gets +1 STR for each gold he has.
    // Action: Discard 1 gold from Ser Garlan Tyrell to choose a [tyrell] character. Until the end
    // of the phase, that character gets +2 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(
                (card, context) => context.source.tokens[Tokens.gold]
            )
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
            message:
                '{player} discards 1 gold from {source} to give {target} +2 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(2)
            }))
        });
    }
}

SerGarlanTyrell.code = '06083';

export default SerGarlanTyrell;
