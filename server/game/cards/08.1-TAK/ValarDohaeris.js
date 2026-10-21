import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class ValarDohaeris extends PlotCard {
    // Valar Dohaeris (08020)
    // When Revealed: Each player chooses any number of characters he or she controls with a total
    // printed cost of 10 or lower. Place each character not chosen on the bottom of its owner's
    // deck (cannot be saved).
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
            gameAction: GameActions.simultaneously((context) =>
                this.toBeMoved(context).map((card) =>
                    GameActions.returnCardToDeck({ card, bottom: true, allowSave: false })
                )
            )
        });
    }

    toBeMoved(context) {
        const targets = context.targets.getTargets();
        return this.game.filterCardsInPlay(
            (card) => card.getType() === 'character' && !targets.includes(card)
        );
    }
}

ValarDohaeris.code = '08020';

export default ValarDohaeris;
