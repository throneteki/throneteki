const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class SerImryFlorent extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Force kneel',
            cost: ability.costs.killSelf(),
            chooseOpponent: (opponent) =>
                opponent.anyCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        !card.kneeled &&
                        card.allowGameAction('kneel')
                ),
            target: {
                type: 'select',
                mode: 'unlimited',
                activePromptTitle: 'Select any number of locations',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.controller === context.player,
                gameAction: 'sacrifice'
            },
            message: '{player} kills {source} to sacrifice {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) => GameActions.sacrificeCard({ card }))
                    ).then((context) => ({
                        player: context.opponent,
                        target: {
                            mode: 'exactly',
                            numCards: Math.min(
                                context.target.length,
                                context.opponent.getNumberOfCardsInPlay(
                                    (card) => card.getType() === 'character' && !card.kneeled
                                )
                            ),
                            cardCondition: (card) =>
                                card.getType() === 'character' &&
                                !card.kneeled &&
                                card.location === 'play area' &&
                                card.controller === context.opponent,
                            gameAction: 'kneel'
                        },
                        message: 'Then {player} kneels {target} for {source}',
                        handler: (thenContext) => {
                            this.game.resolveGameAction(
                                GameActions.simultaneously(
                                    thenContext.target.map((card) =>
                                        GameActions.kneelCard({ card })
                                    )
                                ),
                                thenContext
                            );
                        }
                    })),
                    context
                );
            }
        });
    }
}

SerImryFlorent.code = '14011';

module.exports = SerImryFlorent;
