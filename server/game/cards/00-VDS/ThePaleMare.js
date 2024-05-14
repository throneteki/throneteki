const PlotCard = require('../../plotcard');

class ThePaleMare extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                optional: true,
                ifAble: true,
                activePromptTitle: 'Select character(s)',
                maxStat: () => 10,
                cardStat: (card) => card.getPrintedCost(),
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                let toKill = [];

                for (let selection of context.targets.selections) {
                    let player = selection.choosingPlayer;
                    let charactersInPlay = player.filterCardsInPlay(
                        (card) => card.getType() === 'character'
                    );
                    let selectedCards = selection.value || [];
                    let playerSpecificToKill = charactersInPlay.filter(
                        (card) => !selectedCards.includes(card)
                    );
                    toKill = toKill.concat(playerSpecificToKill);

                    if (playerSpecificToKill.length === 0) {
                        this.game.addMessage(
                            '{0} does not kill any characters for {1}',
                            player,
                            this
                        );
                    } else {
                        this.game.addMessage(
                            '{0} kills {1} for {2}',
                            player,
                            playerSpecificToKill,
                            this
                        );
                    }
                }

                this.game.killCharacters(toKill, { allowSave: false });
            }
        });
    }
}

ThePaleMare.code = '00008';

module.exports = ThePaleMare;
