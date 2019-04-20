const PlotCard = require('../../plotcard');
const Messages = require('../../Messages');

class NothingBurnsLikeTheCold extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            targets: {
                attachment: {
                    choosingPlayer: 'each',
                    ifAble: true,
                    activePromptTitle: 'Select an attachment',
                    cardCondition: (card, context) => card.location === 'play area' && card.controller === context.choosingPlayer && card.getType() === 'attachment',
                    gameAction: 'discard',
                    messages: Messages.eachPlayerTargetingForCardType('attachments')
                },
                location: {
                    choosingPlayer: 'each',
                    ifAble: true,
                    activePromptTitle: 'Select a location',
                    cardCondition: (card, context) => card.location === 'play area' && card.controller === context.choosingPlayer && card.getType() === 'location' && !card.isLimited(),
                    gameAction: 'discard',
                    messages: Messages.eachPlayerTargetingForCardType('locations')
                }
            },
            handler: context => {
                let cards = context.targets.selections.map(selection => selection.value).filter(card => !!card);
                this.game.discardFromPlay(cards, { allowSave: false });
            }
        });
    }
}

NothingBurnsLikeTheCold.code = '09052';

module.exports = NothingBurnsLikeTheCold;
