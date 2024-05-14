const PlotCard = require('../../plotcard.js');

class PoliticalDisaster extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                numCards: 2,
                optional: true,
                ifAble: true,
                activePromptTitle: 'Select up to 2 locations',
                cardCondition: (card, context) =>
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'location' &&
                    card.location === 'play area'
            },
            handler: (context) => {
                let toDiscard = [];
                for (let selection of context.targets.selections) {
                    let player = selection.choosingPlayer;
                    let locations = player.filterCardsInPlay(
                        (card) => card.getType() === 'location'
                    );
                    let selectedCards = selection.value || [];
                    let remainingLocations = locations.filter(
                        (location) => !selectedCards.includes(location)
                    );

                    toDiscard = toDiscard.concat(remainingLocations);

                    if (remainingLocations.length !== 0) {
                        this.game.addMessage(
                            '{0} discards {1} for {2}',
                            player,
                            remainingLocations,
                            this
                        );
                    }
                }

                this.game.discardFromPlay(toDiscard);
            }
        });
    }
}

PoliticalDisaster.code = '02040';

module.exports = PoliticalDisaster;
