const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');

class ValarDohaeris extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                optional: true,
                ifAble: true,
                activePromptTitle: 'Select character(s)',
                maxStat: () => 10,
                cardStat: card => card.getPrintedCost(),
                cardCondition: (card, context) => card.location === 'play area' && card.controller === context.choosingPlayer && card.getType() === 'character'
            },
            message: context => {
                const toBeMoved = this.toBeMoved(context);
                context.targets.selections.map(selection => selection.choosingPlayer).forEach(player => {
                    const cards = toBeMoved.filter(card => card.owner === player);
                    if(cards.length > 0) {
                        this.game.addMessage('{0} moves {1} to the bottom of their deck for {2}', player, cards, context.source);
                    } else {
                        this.game.addMessage('{0} does not have any cards moved to the bottom of their deck for {1}', player, context.source);
                    }
                });
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(context =>
                        this.toBeMoved(context).map(card => GameActions.returnCardToDeck({ card, bottom: true, allowSave: false }))
                    ),
                    context
                );
            }
        });
    }

    toBeMoved(context) {
        const targets = context.targets.getTargets();
        return this.game.filterCardsInPlay(card => card.getType() === 'character' && !targets.includes(card));
    }
}

ValarDohaeris.code = '08020';

module.exports = ValarDohaeris;
