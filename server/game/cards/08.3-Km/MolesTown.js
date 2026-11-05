import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class MolesTown extends DrawCard {
    // Mole's Town (08046)
    // Bestow (4).
    // Challenges Action: Kneel Mole's Town to choose a character without gold. Move 1 gold from
    // Mole's Town to that character. Then, that character cannot be declared as an attacker until
    // the end of the phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'Move gold to character',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.hasToken(Tokens.gold)
            },
            message: '{player} kneels {source} to move 1 gold to {target}',
            gameAction: GameActions.transferGold((context) => ({
                from: context.source,
                to: context.target,
                amount: 1
            })).then({
                message: {
                    format: 'Then {character} cannot be declared as an attacker until the end of the phase',
                    args: { character: (context) => context.parentContext.target }
                },
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.parentContext.target,
                    effect: ability.effects.cannotBeDeclaredAsAttacker()
                }))
            })
        });
    }
}

MolesTown.code = '08046';

export default MolesTown;
