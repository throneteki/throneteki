const PlotCard = require('../../plotcard');

class WildfireAssault extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                numCards: 3,
                optional: true,
                ifAble: true,
                activePromptTitle: 'Select up to 3 characters',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                let characters = [];

                for (let selection of context.targets.selections) {
                    let player = selection.choosingPlayer;
                    let selectedCards = selection.value || [];
                    let charactersInPlay = player.filterCardsInPlay(
                        (card) => card.getType() === 'character'
                    );
                    let toKill = charactersInPlay.filter((card) => !selectedCards.includes(card));

                    characters = characters.concat(toKill);

                    if (toKill.length === 0) {
                        this.game.addMessage(
                            '{0} does not kill any characters for {1}',
                            player,
                            this
                        );
                    } else {
                        this.game.addMessage('{0} kills {1} for {2}', player, toKill, this);
                    }
                }

                this.game.killCharacters(characters, { allowSave: false });
            }
        });
    }
}

WildfireAssault.code = '01026';

module.exports = WildfireAssault;
