import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import Message from '../../Message.js';
import TextHelper from '../../TextHelper.js';
import { flatten } from '../../../Array.js';

class TheLostMessage extends PlotCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Shuffle cards into deck',
            message:
                '{player} uses {source} to have each player shuffle their hand into their deck',
            gameAction: GameActions.shuffleIntoDeck(() => ({
                cards: flatten(this.game.getPlayers().map((player) => player.hand))
            })).then({
                message: {
                    format: 'Then {fragments} for {source}',
                    args: { fragments: (context) => this.getMessageFragments(context) }
                },
                gameAction: GameActions.simultaneously((context) =>
                    this.getTopCards(context).map((card) => GameActions.addToHand({ card }))
                )
            }),
            limit: ability.limit.perRound(1)
        });
    }

    getPlayerHandSizes(event) {
        const events = event
            .getConcurrentEvents()
            .filter((event) => event.name === 'onCardsShuffledIntoDeck');
        const shuffledCards = flatten(events.map((event) => event.cards));

        const players = this.game.getPlayers();
        return players.map((player) => ({
            player,
            amount: shuffledCards.filter((card) => card.owner === player).length
        }));
    }

    getMessageFragments(context) {
        const playerHandSizes = this.getPlayerHandSizes(context.event);
        return playerHandSizes.map((handSize) =>
            Message.fragment('{player} adds {numCards} to hand', {
                player: handSize.player,
                numCards: TextHelper.count(handSize.amount, 'card')
            })
        );
    }

    getTopCards(context) {
        const playerHandSizes = this.getPlayerHandSizes(context.event);
        const topCards = flatten(
            playerHandSizes.map((handSize) => handSize.player.drawDeck.slice(0, handSize.amount))
        );
        return topCards;
    }
}

TheLostMessage.code = '15047';

export default TheLostMessage;
