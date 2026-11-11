import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class FeastOrFamine extends PlotCard {
    // Feast or Famine (00006)
    // When Revealed: You may increase the gold value on Feast or Famine by 5. If you do, reduce the
    // claim value on Feast of Famine by 2.
    // Draft format only.
    setupCardAbilities(ability) {
        this.whenRevealed({
            gameAction: GameActions.may({
                title: (context) => `Increase gold value on ${context.source.name} by 5?`,
                message:
                    '{player} increases the gold value by 5 and reduces the claim value by 2 on {source}',
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfRound',
                    match: context.source,
                    effect: [ability.effects.modifyGold(5), ability.effects.modifyClaim(-2)]
                }))
            })
        });
    }
}

FeastOrFamine.code = '00006';

export default FeastOrFamine;
