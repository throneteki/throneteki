const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');
const Message = require('../../Message');
const TextHelper = require('../../TextHelper');
const {flatten} = require('../../../Array');

class TheLostMessage extends PlotCard {
    setupCardAbilities() {
        this.action({
            title: 'Shuffle cards into deck',
            message: '{player} uses {source} to have each player shuffle their hand into their deck',
            gameAction: GameActions.simultaneously(() => this.game.getPlayers().map(
                player => GameActions.shuffleIntoDeck({ cards: player.hand })
            )).then({
                message: {
                    format: 'Then {fragments} for {source}',
                    args: { fragments: context => this.getMessageFragments(context) }
                },
                gameAction: GameActions.simultaneously(context => this.getTopCards(context).map(
                    card => GameActions.addToHand({ card })
                ))
            })
        });
    }

    getPlayerHandSizes(event) {
        const events = event.getConcurrentEvents().filter(event => event.name === 'onCardsShuffledIntoDeck');
        const shuffledCards = flatten(events.map(event => event.cards));

        const players = this.game.getPlayers();
        return players.map(player => ({
            player,
            amount: shuffledCards.filter(card => card.owner === player).length
        }));
    }

    getMessageFragments(context) {
        const playerHandSizes = this.getPlayerHandSizes(context.event);
        return playerHandSizes.map(handSize =>
            Message.fragment('{player} adds {numCards} to hand', {
                player: handSize.player,
                numCards: TextHelper.count(handSize.amount, 'card')
            })
        );
    }

    getTopCards(context) {
        const playerHandSizes = this.getPlayerHandSizes(context.event);
        const topCards = flatten(playerHandSizes.map(handSize => handSize.player.drawDeck.slice(0, handSize.amount)));
        return topCards;
    }
}

TheLostMessage.code = '15047';

module.exports = TheLostMessage;
