import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BattleOfTheBlackwater extends PlotCard {
    // Battle of the Blackwater (04120)
    // When Revealed: Choose an opponent. Discard each duplicate you control and each duplicate
    // controlled by that opponent from play.
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            message:
                '{player} uses {source} to have themself and {opponent} discard each duplicate they control',
            gameAction: GameActions.simultaneously((context) =>
                context.game.allCards
                    .filter(
                        (card) =>
                            [context.player, context.opponent].includes(card.controller) &&
                            card.location === 'duplicate'
                    )
                    .map((card) => GameActions.discardCard({ card, allowSave: false }))
            )
        });
    }
}

BattleOfTheBlackwater.code = '04120';

export default BattleOfTheBlackwater;
