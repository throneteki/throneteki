import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class MarchedToTheWall extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character',
                gameAction: GameActions.discardCard((context) => ({
                    card: context.target,
                    allowSave: false
                }))
            }
        });
    }
}

MarchedToTheWall.code = '01015';

export default MarchedToTheWall;
