const PlotCard = require('../../plotcard');

class CityOfSecrets extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: context => {
                this.game.addMessage('{0} uses {1} to have each player draw 2 cards', context.player, this);
                let players = this.game.getPlayersInFirstPlayerOrder();
                for(let player of players) {
                    player.drawCardsToHand(2);
                }

                let playersWithoutCity = players.filter(player => !this.hasUsedCityPlot(player) && player.hand.length >= 2);

                for(let player of playersWithoutCity) {
                    this.game.promptForSelect(player, {
                        mode: 'exactly',
                        numCards: 2,
                        activePromptTitle: 'Select 2 cards',
                        cardCondition: card => card.location === 'hand' && card.controller === player,
                        onSelect: (player, cards) => this.cardSelected(player, cards),
                        onCancel: (player) => this.promptCancelled(player),
                        source: this
                    });
                }
            }
        });
    }

    hasUsedCityPlot(player) {
        return player.plotDiscard.some(plot => plot.hasTrait('City'));
    }

    cardSelected(player, cards) {
        this.game.addMessage('Then {0} discards {1}', player, cards);
        player.discardCards(cards);
        return true;
    }

    promptCancelled(player) {
        this.game.addAlert('danger', '{0} cancels resolution of {1}', player, this);
        return true;
    }
}

CityOfSecrets.code = '13019';

module.exports = CityOfSecrets;
