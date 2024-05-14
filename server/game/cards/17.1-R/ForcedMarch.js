const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');
const KneelCard = require('../../GameActions/KneelCard');

class ForcedMarch extends PlotCard {
    setupCardAbilities() {
        const isStandingAndKneelableMilIcon = (card) => {
            return (
                card.isMatch({ type: 'character' }) &&
                card.hasIcon('military') &&
                KneelCard.allow({ card })
            );
        };

        this.whenRevealed({
            target: {
                type: 'select',
                mode: 'unlimited',
                cardCondition: (card, context) =>
                    isStandingAndKneelableMilIcon(card) && card.controller === context.player
            },
            message: '{player} uses {source} to kneel {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously((context) =>
                        context.target.map((card) => GameActions.kneelCard({ card }))
                    ).then((preThenContext) => ({
                        handler: (context) => {
                            const charactersWithMilIcon = preThenContext.target.length;
                            for (let opponent of this.game.getOpponents(context.player)) {
                                let numCards = Math.min(
                                    charactersWithMilIcon,
                                    opponent.getNumberOfCardsInPlay(isStandingAndKneelableMilIcon)
                                );

                                if (numCards === 0) {
                                    continue;
                                }

                                this.game.promptForSelect(opponent, {
                                    source: this,
                                    cardCondition: (card) =>
                                        isStandingAndKneelableMilIcon(card) &&
                                        card.controller === opponent,
                                    gameAction: 'kneel',
                                    mode: 'exactly',
                                    numCards: numCards,
                                    onSelect: (player, cards) =>
                                        this.onCardsSelected(player, cards),
                                    onCancel: (player) => this.onCancel(player)
                                });
                            }
                        }
                    })),
                    context
                );
            }
        });
    }

    onCardsSelected(player, cards) {
        this.game.addMessage('Then {0} kneels {1} for {2}', player, cards, this);
        this.game.resolveGameAction(
            GameActions.simultaneously(cards.map((card) => GameActions.kneelCard({ card })))
        );
        return true;
    }

    onCancel(player) {
        this.game.addAlert('danger', '{0} did not select characters for {1}', player, this);
        return true;
    }
}

ForcedMarch.code = '17154';

module.exports = ForcedMarch;
