import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MathisRowan extends DrawCard {
    // Mathis Rowan (15037)
    // Action: Choose an opponent and a character, location, or attachment you control. That player
    // takes control of that card. Then, gain 2 gold. (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Give control of card',
            limit: ability.limit.perRound(1),
            chooseOpponent: () => true,
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.isMatch({
                        location: 'play area',
                        type: ['character', 'attachment', 'location']
                    }) &&
                    card.controller === this.controller &&
                    (!context.opponent || context.opponent.canControl(card))
            },
            message: '{player} uses {source} to give {opponent} control of {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.takeControl((context) => ({
                        player: context.opponent,
                        card: context.target
                    })).then((context) => ({
                        condition: () => context.player.canGainGold(),
                        message: 'Then {player} gains 2 gold for {source}',
                        handler: (thenContext) => {
                            this.game.resolveGameAction(
                                GameActions.gainGold((thenContext) => ({
                                    player: thenContext.player,
                                    amount: 2
                                })),
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

MathisRowan.code = '15037';

export default MathisRowan;
