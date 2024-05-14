const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class NoSurprises extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reveal your hand',
            condition: (context) => context.player.hand.length > 1,
            message: '{player} plays {source} to reveal their hand',
            gameAction: GameActions.revealCards((context) => ({
                player: context.player,
                cards: context.player.hand
            })).then({
                message: {
                    format: 'Then, until the end of the phase, {opponents} cannot play events or bring cards out of shadows',
                    args: { opponents: (context) => context.game.getOpponents(context.player) }
                },
                handler: (context) => {
                    for (const opponent of context.game.getOpponents(context.player)) {
                        this.untilEndOfPhase((ability) => ({
                            match: opponent,
                            effect: [
                                ability.effects.cannotPutIntoPlay(
                                    (card) => card.location === 'shadows'
                                ),
                                ability.effects.cannotPlay(
                                    (card) => card.getPrintedType() === 'event'
                                )
                            ]
                        }));
                    }
                }
            })
        });
    }
}

NoSurprises.code = '13022';

module.exports = NoSurprises;
