const DrawCard = require('../../drawcard');
const shuffle = require('lodash.shuffle');

class BoundForTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, attackingPlayer: this.controller })
            },
            handler: context => {
                const loser = context.event.challenge.loser;
                const topCards = loser.drawDeck.slice(0, 5);
                const revealFunc = card => topCards.includes(card);
                this.game.addMessage('{0} plays {1} to reveal {2} on top of {3}\'s deck', context.player, this, topCards, loser);

                this.game.queueSimpleStep(() => {
                    this.game.cardVisibility.addRule(revealFunc);
                });
                this.game.promptForSelect(context.player, {
                    cardCondition: card => topCards.includes(card) && card.controller === loser && card.location === 'draw deck' && card.getType() === 'character' && context.player.canPutIntoPlay(card),
                    onSelect: (player, card) => this.handleSelect({ player, card, loser, topCards }),
                    onCancel: (player) => this.handleCancel({player, loser, topCards}),
                    source: this
                });
                this.game.queueSimpleStep(() => {
                    this.game.cardVisibility.removeRule(revealFunc);
                });
            },
            max: ability.limit.perChallenge(1)
        });
    }

    handleSelect({ player, card, loser, topCards }) {
        const remainingCards = topCards.filter(c => c !== card);
        this.game.addMessage('Then {0} chooses to put {1} into play. {2} are placed on the bottom of {3}\'s deck in random order.', player, card, remainingCards, loser);
        player.putIntoPlay(card);
        this.placeCardsOnBottom({ loser, cards: remainingCards });
        return true;
    }

    handleCancel({ player, loser, topCards }) {
        this.game.addMessage('Then {0} does not choose to put a card into play. {1} are placed on the bottom of {2}\'s deck in random order.', player, topCards, loser);
        this.placeCardsOnBottom({ loser, cards: topCards });
        return true;
    }

    placeCardsOnBottom({ loser, cards }) {
        for(let card of shuffle(cards)) {
            loser.moveCard(card, 'draw deck', { bottom: true });
        }
    }
}

BoundForTheWall.code = '13086';

module.exports = BoundForTheWall;
