import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GiftsForTheWidow extends DrawCard {
    setupCardAbilities() {
        this.xValue({ min: () => 0, max: () => 99 });

        this.action({
            title: 'Search for attachment',
            message: {
                format: '{player} plays {source} to search their deck for an attachment with printed cost {xValue} or lower',
                args: { xValue: (context) => context.xValue }
            },
            gameAction: GameActions.search({
                title: 'Select an attachment',
                match: {
                    type: 'attachment',
                    condition: (card, context) =>
                        card.hasPrintedCost() && card.getPrintedCost() <= context.xValue
                },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget,
                    attachmentTargets: (card) => card.controller === context.player
                }))
            })
        });
    }
}

GiftsForTheWidow.code = '11114';

export default GiftsForTheWidow;
