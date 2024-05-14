import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GiftsForTheWidow extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for attachment',
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.payXGold(
                    () => 0,
                    () => 99
                )
            ],
            message: {
                format: '{player} plays {source} and kneels their faction card to search their deck for an attachment with printed cost {xValue} or lower',
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

GiftsForTheWidow.code = '17135';

export default GiftsForTheWidow;
