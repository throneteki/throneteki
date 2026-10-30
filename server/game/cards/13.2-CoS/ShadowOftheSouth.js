import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowOfTheSouth extends DrawCard {
    // Shadow of the South (13036)
    // Shadow (1).
    // Action: Choose a character. Until the end of the phase, that character loses a challenge icon
    // of your choice. If there is a Scheme plot card revealed, return Shadow of the South to your
    // hand instead of placing it in your discard pile.
    setupCardAbilities(ability) {
        this.action({
            title: 'Select a character',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            gameAction: GameActions.simultaneously([
                GameActions.chooseIcon({
                    message: '{player} plays {source} to remove {icon} icon from {target}',
                    gameAction: (icon) =>
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.removeIcon(icon)
                        }))
                }),
                GameActions.ifCondition({
                    condition: (context) => context.game.anyPlotHasTrait('Scheme'),
                    thenAction: GameActions.returnCardToHand((context) => ({
                        card: context.source
                    }))
                })
            ])
        });
    }
}

ShadowOfTheSouth.code = '13036';

export default ShadowOfTheSouth;
