import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class WildfireAssault extends PlotCard {
    // Wildfire Assault (01026)
    // When Revealed: Each player chooses up to 3 characters he or she controls. Kill each character
    // not chosen (cannot be saved).
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                numCards: 3,
                optional: true,
                ifAble: true,
                activePromptTitle: 'Select up to 3 characters',
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

WildfireAssault.code = '01026';

export default WildfireAssault;
