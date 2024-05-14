const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const Message = require('../../Message');

class FriendsAtCourt extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                type: 'select',
                numCards: 3,
                activePromptTitle: 'Select 3 cards',
                cardCondition: (card) => card.location === 'shadows'
            },
            message: '{player} uses {source} to look at up to 3 cards in shadow',
            handler: (context) => {
                this.game.addMessage('{player} looks at {positions}', {
                    player: context.player,
                    positions: this.positionsMessages(context.target)
                });

                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: (card) => context.target.includes(card),
                    revealTargets: true,
                    onSelect: (player, card) => this.handleSelectCard(player, card),
                    source: this
                });
            }
        });
    }

    positionsMessages(cards) {
        const playersToCards = this.groupCardsByPlayer(cards);
        let messages = [];
        for (let [player, positions] of playersToCards.entries()) {
            positions.sort();
            messages.push(
                Message.fragment("card {positions} in {player}'s shadow area", {
                    positions: positions.map((position) => `#${position}`),
                    player
                })
            );
        }
        return messages;
    }

    groupCardsByPlayer(cards) {
        const playersToCards = new Map();
        for (const card of cards) {
            const player = card.controller;
            const cardsForPlayer = playersToCards.get(player) || [];
            cardsForPlayer.push(card.getShadowPosition());
            playersToCards.set(card.controller, cardsForPlayer);
        }

        return playersToCards;
    }

    handleSelectCard(player, card) {
        if (player.getSpendableGold({ player, playingType: 'ability' }) >= 2) {
            this.game.spendGold({ amount: 2, player });
            this.game.addMessage(
                "Then {0} pays 2 gold to return card #{1} in {2}'s shadow area to its owner's hand",
                player,
                card.getShadowPosition(),
                card.controller
            );
            this.game.resolveGameAction(GameActions.returnCardToHand({ card }));
        }

        return true;
    }
}

FriendsAtCourt.code = '13115';

module.exports = FriendsAtCourt;
