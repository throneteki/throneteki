import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

function isMilitaryCharacter(card) {
    return (
        card.location === 'play area' && card.getType() === 'character' && card.hasIcon('military')
    );
}

class ForcedMarch extends PlotCard {
    // Forced March (17154)
    // When Revealed: Kneel X characters you control with a [military] icon. Then, each opponent
    // must choose and kneel X characters they control with a [military] icon, if able.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                mode: 'unlimited',
                activePromptTitle: 'Select characters',
                cardCondition: (card, context) =>
                    isMilitaryCharacter(card) && card.controller === context.player,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.kneelCard({ card }))
            ).then({
                gameAction: GameActions.chooseCards({
                    players: (context) => context.game.getOpponents(context.player),
                    title: (context) =>
                        `Select ${context.parentContext.target.length} characters to kneel`,
                    mode: 'exactly',
                    numCards: (context) => context.parentContext.target.length,
                    cardCondition: (card, context) =>
                        isMilitaryCharacter(card) && card.controller === context.choosingPlayer,
                    gameAction: (card) => GameActions.kneelCard({ card })
                })
            })
        });
    }
}

ForcedMarch.code = '17154';

export default ForcedMarch;
