import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class TheIronBank extends DrawCard {
    // The Iron Bank (08019)
    // Bestow (1).
    // During the marshaling phase, you may spend gold on The Iron Bank as if it were in your gold
    // pool.
    // Reaction: After you collect income, move X gold from the treasury to The Iron Bank. X is the
    // number of gold on The Iron Bank.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.currentPhase === 'marshal',
            match: this,
            effect: ability.effects.canSpendGold(
                (spendParams, context) => spendParams.activePlayer === context.source.controller
            )
        });
        this.reaction({
            when: {
                onIncomeCollected: (event, context) => event.player === context.player
            },
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.gold,
                amount: context.source.gold
            }))
        });
    }
}

TheIronBank.code = '08019';

export default TheIronBank;
