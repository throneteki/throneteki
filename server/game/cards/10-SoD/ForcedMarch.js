import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

const isStandingMilIcon = (card) =>
    card.location === 'play area' &&
    card.hasIcon('military') &&
    !card.kneeled &&
    card.canBeKneeled();

class ForcedMarch extends PlotCard {
    // Forced March (10048)
    // When Revealed: Each opponent kneels 1 character he or she controls with a [military] icon.
    // Then, you may kneel a character with a [military] icon to initiate this effect again.
    setupCardAbilities(ability) {
        this.whenRevealed({
            target: {
                choosingPlayer: 'eachOpponent',
                ifAble: true,
                cardCondition: (card, context) =>
                    isStandingMilIcon(card) && card.controller === context.choosingPlayer
            },
            message: '{player} uses {source} to have each opponent kneel {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.targets.getTargets().map((card) => GameActions.kneelCard({ card }))
            ).then({
                condition: (context) =>
                    context.game
                        .getOpponents(context.player)
                        .some((opponent) => opponent.anyCardsInPlay(isStandingMilIcon)),
                cost: ability.costs.kneel((card) => isStandingMilIcon(card)),
                message: {
                    format: '{player} then kneels {kneeled} to initiate the effect of {source} again',
                    args: { kneeled: (context) => context.costs.kneel }
                },
                gameAction: GameActions.initiateWhenRevealed((context) => ({
                    plot: context.source,
                    player: context.player
                }))
            })
        });
    }
}

ForcedMarch.code = '10048';

export default ForcedMarch;
