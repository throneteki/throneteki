import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class PoliticalDisaster extends PlotCard {
    // Political Disaster (02040)
    // When Revealed: Each player chooses up to 2 locations he or she controls. Each location not
    // chosen is discarded from play.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                numCards: 2,
                optional: true,
                ifAble: true,
                activePromptTitle: 'Select up to 2 locations',
                cardCondition: (card, context) =>
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'location' &&
                    card.location === 'play area'
            },
            message: {
                format: '{player} uses {source} to discard {locations}',
                args: { locations: (context) => notChosen(context) }
            },
            gameAction: GameActions.simultaneously((context) =>
                notChosen(context).map((card) => GameActions.discardCard({ card }))
            )
        });
    }
}

function notChosen(context) {
    return context.targets.selections.flatMap((selection) => {
        const chosen = selection.value || [];
        return selection.choosingPlayer.filterCardsInPlay(
            (card) => card.getType() === 'location' && !chosen.includes(card)
        );
    });
}

PoliticalDisaster.code = '02040';

export default PoliticalDisaster;
