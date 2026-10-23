import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

const isEligible = (card) =>
    card.location === 'active plot' && card.getType() === 'plot' && !card.hasTrait('Riddle');

class VaryssRiddle extends PlotCard {
    // Varys's Riddle (04020)
    // When Revealed: Initiate the when revealed ability on a revealed non-Riddle plot card as if
    // you had just revealed it.
    setupCardAbilities() {
        this.whenRevealed({
            gameAction: GameActions.simultaneously((context) => {
                const plots = context.game.allCards.filter((card) => isEligible(card));
                if (plots.length === 1) {
                    return [
                        GameActions.initiateWhenRevealed({ plot: plots[0], player: context.player })
                    ];
                }

                return [
                    GameActions.chooseCards({
                        title: 'Select a plot',
                        cardCondition: (card) => isEligible(card),
                        gameAction: (plot, context) =>
                            GameActions.initiateWhenRevealed({ plot, player: context.player })
                    })
                ];
            })
        });
    }
}

VaryssRiddle.code = '04020';

export default VaryssRiddle;
