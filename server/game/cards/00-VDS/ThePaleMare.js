import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class ThePaleMare extends PlotCard {
    // The Pale Mare (00008)
    // When Revealed: Each player chooses any number of characters he or she controls with total
    // printed cost 10 or lower. Kill each character not chosen (cannot be saved).
    // Draft format only.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                optional: true,
                ifAble: true,
                activePromptTitle: 'Select character(s)',
                maxStat: () => 10,
                cardStat: (card) => card.getPrintedCost(),
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character'
            },
            message: {
                format: '{player} uses {source} to kill {characters}',
                args: { characters: (context) => notChosen(context) }
            },
            gameAction: GameActions.simultaneously((context) =>
                notChosen(context).map((card) => GameActions.kill({ card, allowSave: false }))
            )
        });
    }
}

function notChosen(context) {
    return context.targets.selections.flatMap((selection) => {
        const chosen = selection.value || [];
        return selection.choosingPlayer.filterCardsInPlay(
            (card) => card.getType() === 'character' && !chosen.includes(card)
        );
    });
}

ThePaleMare.code = '00008';

export default ThePaleMare;
