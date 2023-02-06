const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class GiftsForTheWidow extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for attachment',
            cost: ability.costs.payXGold(() => 0, () => 99),
            gameAction: GameActions.search({
                title: 'Select an attachment',
                match: { type: 'attachment', condition: (card, context) => card.hasPrintedCost() && card.getPrintedCost() <= context.xValue },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget,
                    attachmentTargets: card => card.controller === context.player
                }))
            })
        });
    }
}

GiftsForTheWidow.code = '11114';

module.exports = GiftsForTheWidow;
