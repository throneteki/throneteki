import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class WexPyke extends DrawCard {
    // Wex Pyke (06031)
    // Bestow (8).
    // While Wex Pyke is attacking, each character with printed cost X cannot be declared as a
    // defender. X is the number of gold Wex Pyke has.
    // Dominance Action: Move 1 gold from your gold pool to Wex Pyke. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            targetController: 'any',
            match: (card, context) =>
                card.getType() === 'character' &&
                card.getPrintedCost() === context.source.tokens[Tokens.gold],
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
        this.action({
            title: 'Move gold to Wex Pyke',
            phase: 'dominance',
            limit: ability.limit.perPhase(2),
            message: '{player} moves 1 gold from their gold pool to {source}',
            gameAction: GameActions.transferGold((context) => ({
                from: context.player,
                to: context.source,
                amount: 1
            }))
        });
    }
}

WexPyke.code = '06031';

export default WexPyke;
