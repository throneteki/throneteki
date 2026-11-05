import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheQueensAssassin extends DrawCard {
    // The Queen's Assassin (01095)
    // Ambush (4).
    // Reaction: After The Queen's Assassin enters play using ambush, choose an opponent. If you
    // have more cards in hand than that player, he or she must choose and kill a character he or
    // she controls.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'ambush'
            },
            chooseOpponent: (opponent, context) =>
                opponent.getHandCount() < context.player.getHandCount(),
            message: '{player} uses {source} to have {opponent} choose and kill a character',
            gameAction: GameActions.chooseCards({
                player: (context) => context.opponent,
                title: 'Select a character to kill',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.kill({ card })
            })
        });
    }
}

TheQueensAssassin.code = '01095';

export default TheQueensAssassin;
