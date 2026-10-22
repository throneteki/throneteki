import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class UnexpectedDelay extends PlotCard {
    // Unexpected Delay (05047)
    // Forced Reaction: After the challenges phase begins, each player chooses a character without
    // attachments or power. Return each of those characters to its owner's hand.
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
                args: { chosenCards: (context) => getChosenCards(context) }
            },
            gameAction: GameActions.simultaneously((context) =>
                getChosenCards(context).map((card) => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

function getChosenCards(context) {
    return [...new Set(context.targets.getTargets())];
}

UnexpectedDelay.code = '05047';

export default UnexpectedDelay;
