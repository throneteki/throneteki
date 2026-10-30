import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class PowerBehindTheThrone extends PlotCard {
    // Power Behind the Throne (01018)
    // When Revealed: Place 1 stand token on Power Behind the Throne.
    // Action: Discard 1 stand token from Power Behind the Throne to choose and stand a character.
    setupCardAbilities(ability) {
        this.whenRevealed({
            message: '{player} uses {source} to place 1 stand token on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.stand
            }))
        });

        this.action({
            title: 'Discard a stand token',
            cost: ability.costs.discardTokenFromSelf(Tokens.stand),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: '{player} uses {source} to remove a stand token and stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

PowerBehindTheThrone.code = '01018';

export default PowerBehindTheThrone;
