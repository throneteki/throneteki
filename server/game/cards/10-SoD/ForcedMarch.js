const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');

class ForcedMarch extends PlotCard {
    setupCardAbilities(ability) {
        this.whenRevealed({
            target: {
                choosingPlayer: 'eachOpponent',
                ifAble: true,
                cardCondition: (card, context) =>
                    this.isStandingMilIcon(card) && card.controller === context.choosingPlayer
            },
            handler: (context) => {
                let cards = context.targets.selections
                    .map((selection) => selection.value)
                    .filter((card) => !!card);
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        cards.map((card) => GameActions.kneelCard({ card }))
                    ).then((originalContext) => ({
                        condition: () => this.hasValidTargets(originalContext.player),
                        cost: ability.costs.kneel((card) => this.isStandingMilIcon(card)),
                        message: {
                            format: '{player} then kneels {kneeled} to initate the effect of {source} again',
                            args: { kneeled: (context) => context.costs.kneeled }
                        },
                        handler: () => {
                            let newContext = originalContext.ability.createContext(
                                originalContext.event
                            );
                            this.game.resolveAbility(newContext.ability, newContext);
                        }
                    })),
                    context
                );
            }
        });
    }

    hasValidTargets(player) {
        return this.game.getOpponents(player).some((opponent) => this.hasStandingMilIcon(opponent));
    }

    hasStandingMilIcon(player) {
        return player.anyCardsInPlay((card) => this.isStandingMilIcon(card));
    }

    isStandingMilIcon(card) {
        return (
            card.location === 'play area' &&
            card.hasIcon('military') &&
            !card.kneeled &&
            card.canBeKneeled()
        );
    }
}

ForcedMarch.code = '10048';

module.exports = ForcedMarch;
