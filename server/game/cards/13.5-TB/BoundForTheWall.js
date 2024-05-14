const DrawCard = require('../../drawcard');
const shuffle = require('lodash.shuffle');
const GameActions = require('../../GameActions');

class BoundForTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        winner: this.controller,
                        attackingPlayer: this.controller
                    })
            },
            message: {
                format: "{player} plays {source} to reveal the top 5 cards of {loser}'s deck",
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.event.challenge.loser,
                amount: 5,
                whileRevealed: GameActions.genericHandler((context) => {
                    const loser = context.event.challenge.loser;
                    const topCards = context.revealed;
                    this.game.promptForSelect(context.player, {
                        cardCondition: (card) =>
                            topCards.includes(card) &&
                            card.controller === loser &&
                            card.location === 'draw deck' &&
                            card.getType() === 'character' &&
                            context.player.canPutIntoPlay(card),
                        onSelect: (player, card) =>
                            this.handleSelect({ player, card, loser, topCards }),
                        onCancel: (player) => this.handleCancel({ player, loser, topCards }),
                        source: this
                    });
                })
            })),
            max: ability.limit.perChallenge(1)
        });
    }

    handleSelect({ player, card, loser, topCards }) {
        const remainingCards = topCards.filter((c) => c !== card);
        this.game.addMessage(
            "Then {0} chooses to put {1} into play. {2} are placed on the bottom of {3}'s deck in random order.",
            player,
            card,
            remainingCards,
            loser
        );
        player.putIntoPlay(card);
        this.placeCardsOnBottom({ loser, cards: remainingCards });
        return true;
    }

    handleCancel({ player, loser, topCards }) {
        this.game.addMessage(
            "Then {0} does not choose to put a card into play. {1} are placed on the bottom of {2}'s deck in random order.",
            player,
            topCards,
            loser
        );
        this.placeCardsOnBottom({ loser, cards: topCards });
        return true;
    }

    placeCardsOnBottom({ loser, cards }) {
        for (let card of shuffle(cards)) {
            loser.moveCard(card, 'draw deck', { bottom: true });
        }
    }
}

BoundForTheWall.code = '13086';

module.exports = BoundForTheWall;
