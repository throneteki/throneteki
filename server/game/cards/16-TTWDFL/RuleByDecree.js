const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');
const Message = require('../../Message');
const { flatten } = require('../../../Array');

class RuleByDegree extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: (player) =>
                    player.hand.length > 4 && player.hand.length === this.getHighestHandSize(),
                activePromptTitle: 'Select 4 cards to keep',
                mode: 'exactly',
                cardCondition: (card, context) =>
                    card.isMatch({ location: 'hand', controller: context.choosingPlayer }),
                numCards: 4
            },
            message: {
                format: '{player} uses {source} to have {fragments}',
                args: { fragments: (context) => this.getMessageFragments(context) }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously((context) => [
                        ...this.getCardsToDiscard(context).map((card) =>
                            GameActions.discardCard({ card })
                        )
                    ]),
                    context
                );
            }
        });
    }

    getMessageFragments(context) {
        const fragments = [];
        for (const [player, cards] of this.getPlayerCardMapping(context)) {
            fragments.push(Message.fragment('{player} discard {cards}', { player, cards }));
        }
        return fragments;
    }

    getPlayerCardMapping(context) {
        let cardsToDiscard = new Map();
        for (let selection of context.targets.selections) {
            const player = selection.choosingPlayer;
            const selectedCards = selection.value || [];
            const remainingCards = player.hand.filter((card) => !selectedCards.includes(card));

            cardsToDiscard.set(player, remainingCards);
        }

        return cardsToDiscard;
    }

    getCardsToDiscard(context) {
        return flatten([...this.getPlayerCardMapping(context)]);
    }

    getHighestHandSize() {
        return Math.max(...this.game.getPlayers().map((player) => player.hand.length));
    }
}

RuleByDegree.code = '16033';

module.exports = RuleByDegree;
