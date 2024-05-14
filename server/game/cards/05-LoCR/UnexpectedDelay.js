import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class UnexpectedDelay extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            target: {
                choosingPlayer: 'each',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.power === 0 &&
                    card.attachments.length === 0
            },
            message: {
                format: "{source} forces {chosenCards} to return to their owner's hands",
                args: { chosenCards: (context) => this.getChosenCards(context) }
            },
            handler: (context) => {
                const uniqueCards = this.getChosenCards(context);
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        uniqueCards.map((card) => GameActions.returnCardToHand({ card }))
                    ),
                    context
                );
            }
        });
    }

    getChosenCards(context) {
        const cards = context.targets.selections.map((selection) => selection.value);
        return [...new Set(cards)];
    }
}

UnexpectedDelay.code = '05047';

export default UnexpectedDelay;
