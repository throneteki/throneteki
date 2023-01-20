const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class GiftsForTheWidow extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for attachment',
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.payXGold(() => 0, () => 99)
            ],
            gameAction: GameActions.search({
                title: 'Select an attachment',
                match: { type: 'attachment', condition: (card, context) => card.hasPrintedCost() && card.getPrintedCost() <= context.xValue && this.canAttachToControlledCharacter(context.player, card) },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget,
                    attachmentTargets: card => card.controller === context.player
                }))
            })
        });
    }

    canAttachToControlledCharacter(player, attachment) {
        return player.anyCardsInPlay(card => card.getType() === 'character' && player.canAttach(attachment, card));
    }
}

GiftsForTheWidow.code = '17135';

module.exports = GiftsForTheWidow;
