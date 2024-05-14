const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class RedPriest extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            chooseOpponent: (opponent) => opponent.hand.length > 0,
            message: "{player} uses {source} to look at {opponent}'s hand",
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.lookAtHand((context) => ({
                        player: context.player,
                        opponent: context.opponent
                    })).then((context) => ({
                        target: {
                            activePromptTitle: 'Select a card',
                            cardCondition: (card) =>
                                card.location === 'hand' && card.controller === context.opponent,
                            revealTargets: true
                        },
                        message: 'Then {player} uses {source} to remove {target} from the game',
                        handler: (thenContext) => {
                            this.lastingEffect((ability) => ({
                                until: {
                                    onCardLeftPlay: (event) => event.card === this
                                },
                                targetController: 'any',
                                match: thenContext.target,
                                targetLocation: ['hand', 'out of game'],
                                effect: ability.effects.removeFromGame()
                            }));
                        }
                    })),
                    context
                );
            }
        });
    }
}

RedPriest.code = '14012';

module.exports = RedPriest;
