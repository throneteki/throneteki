const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const Message = require('../../Message');
const {flatMap} = require('../../../Array');

class AGiftOfArborRed extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 4 cards of each deck',
            cost: ability.costs.kneelFactionCard(),
            messages: '{player} plays {source} and kneels their faction card to reveal the top 4 cards of each player\'s deck',
            gameAction: GameActions.revealCards(context => ({
                cards: flatMap(context.game.getPlayers(), player => player.searchDrawDeck(4)),
                player: context.player
            })).then({
                target: {
                    activePromptTitle: 'Select a card for each player',
                    mode: 'eachPlayer',
                    cardCondition: (card, context) => context.event.cards.includes(card),
                    revealTargets: true
                },
                message: {
                    format: '{player} {chosenCards}. Each player shuffles their deck.',
                    args: {
                        chosenCards: context => context.target.map(card => Message.fragment('adds {card} to {owner}\'s hand', { card, owner: card.owner }))
                    }
                },
                handler: context => {
                    this.game.resolveGameAction(
                        GameActions.simultaneously(context => [
                            ...context.target.map(card => GameActions.addToHand({ card, player: card.owner })),
                            ...context.game.getPlayers().map(player => GameActions.shuffle({ player }))
                        ]),
                        context
                    );
                }
            })
        });
    }
}

AGiftOfArborRed.code = '02104';

module.exports = AGiftOfArborRed;
