const PlotCard = require('../../plotcard.js');

class UnexpectedDelay extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            target: {
                choosingPlayer: 'each',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.power === 0 && card.attachments.length === 0
            },
            handler: context => {
                for(let selection of context.targets.selections) {
                    let card = selection.value;
                    card.owner.returnCardToHand(card);
                }
            }
        });
    }
}

UnexpectedDelay.code = '05047';

module.exports = UnexpectedDelay;
