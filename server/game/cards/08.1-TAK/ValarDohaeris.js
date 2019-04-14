const PlotCard = require('../../plotcard');

class ValarDohaeris extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                optional: true,
                ifAble: true,
                activePromptTitle: 'Select character(s)',
                maxStat: () => 10,
                cardStat: card => card.getPrintedCost(),
                cardCondition: (card, context) => card.location === 'play area' && card.controller === context.choosingPlayer && card.getType() === 'character'
            },
            handler: context => {
                this.promptPlayersForOrder(context.targets.selections);
            }
        });
    }

    promptPlayersForOrder(selections) {
        let toMove = [];

        for(let selection of selections) {
            let player = selection.choosingPlayer;
            let cardsInPlay = player.filterCardsInPlay(card => card.getType() === 'character' && card.allowGameAction('placeOnBottomOfDeck'));
            let selectedCards = selection.value || [];
            let playerSpecificToMove = cardsInPlay.filter(card => !selectedCards.includes(card));
            toMove = toMove.concat(playerSpecificToMove);
        }

        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            let cardsOwnedByPlayer = toMove.filter(card => card.owner === player);

            if(cardsOwnedByPlayer.length >= 2) {
                this.game.promptForSelect(player, {
                    ordered: true,
                    mode: 'exactly',
                    numCards: cardsOwnedByPlayer.length,
                    activePromptTitle: 'Select bottom deck order (last chosen ends up on bottom)',
                    cardCondition: card => cardsOwnedByPlayer.includes(card),
                    onSelect: (player, selectedCards) => {
                        toMove = toMove.filter(card => card.owner !== player).concat(selectedCards);

                        return true;
                    }
                });
            }
        }

        this.game.queueSimpleStep(() => {
            this.moveCardsToBottom(toMove);
        });
    }

    moveCardsToBottom(toMove) {
        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            let cardsOwnedByPlayer = toMove.filter(card => card.owner === player);

            if(cardsOwnedByPlayer.length !== 0) {
                for(let card of cardsOwnedByPlayer) {
                    this.game.placeOnBottomOfDeck(card, { allowSave: false });
                }

                this.game.addMessage('{0} moves {1} to the bottom of their deck for {2}',
                    player, cardsOwnedByPlayer, this);
            } else {
                this.game.addMessage('{0} does not have any characters moved to the bottom of their deck for {1}',
                    player, this);
            }
        }
    }
}

ValarDohaeris.code = '08020';

module.exports = ValarDohaeris;
