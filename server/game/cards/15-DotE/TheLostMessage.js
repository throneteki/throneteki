import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import Message from '../../Message.js';
import TextHelper from '../../TextHelper.js';
import { flatten } from '../../../Array.js';

class TheLostMessage extends PlotCard {
    // The Lost Message (15047)
    // Action: Each player shuffles his or her hand into his or her deck. Then, each player adds the
    // top X cards of his or her deck to his or her hand. X is the number of cards he or she
    // shuffled this way. (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Shuffle cards into deck',
            message:
                '{player} uses {source} to have each player shuffle their hand into their deck',
            gameAction: GameActions.shuffleIntoDeck((context) => ({
                cards: flatten(context.game.getPlayers().map((player) => player.hand))
            })).then({
                message: {
                    format: 'Then {fragments} for {source}',
                    args: { fragments: (context) => getMessageFragments(context) }
                },
                gameAction: GameActions.simultaneously((context) =>
                    getTopCards(context).map((card) => GameActions.addToHand({ card }))
                )
            }),
            limit: ability.limit.perRound(1)
        });
    }
}

function getPlayerHandSizes(game, event) {
    const events = event
        .getConcurrentEvents()
        .filter((event) => event.name === 'onCardsShuffledIntoDeck');
    const shuffledCards = flatten(events.map((event) => event.cards));

    const players = game.getPlayers();
    return players.map((player) => ({
        player,
        amount: shuffledCards.filter((card) => card.owner === player).length
    }));
}

function getMessageFragments(context) {
    const playerHandSizes = getPlayerHandSizes(context.game, context.event);
    return playerHandSizes.map((handSize) =>
        Message.fragment('{player} adds {numCards} to hand', {
            player: handSize.player,
            numCards: TextHelper.count(handSize.amount, 'card')
        })
    );
}

function getTopCards(context) {
    const playerHandSizes = getPlayerHandSizes(context.game, context.event);
    const topCards = flatten(
        playerHandSizes.map((handSize) => handSize.player.drawDeck.slice(0, handSize.amount))
    );
    return topCards;
}

TheLostMessage.code = '15047';

export default TheLostMessage;
