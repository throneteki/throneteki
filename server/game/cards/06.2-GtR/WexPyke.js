import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class WexPyke extends DrawCard {
    // Wex Pyke (06031)
    // Bestow (8).
    // While Wex Pyke is attacking, each character with printed cost X cannot be declared as a
    // defender. X is the number of gold Wex Pyke has.
    // Dominance Action: Move 1 gold from your gold pool to Wex Pyke. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            targetController: 'any',
            match: (card) =>
                card.getType() === 'character' &&
                card.getPrintedCost() === this.tokens[Tokens.gold],
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });

        this.action({
            title: 'Move gold to ' + this.name,
            condition: () => this.controller.getSpendableGold() >= 1,
            phase: 'dominance',
            limit: ability.limit.perPhase(2),
            handler: (context) => {
                this.game.transferGold({ from: this.controller, to: this, amount: 1 });
                this.game.addMessage(
                    '{0} moves 1 gold from their gold pool to {1}',
                    context.player,
                    this
                );
            }
        });
    }
}

WexPyke.code = '06031';

export default WexPyke;
