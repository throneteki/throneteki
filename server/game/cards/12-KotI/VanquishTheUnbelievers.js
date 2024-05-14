const PlotCard = require('../../plotcard');

class VanquishTheUnbelievers extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Name a trait',
                        controls: [
                            { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    selectTraitName(player, traitName) {
        let characters = player.filterCardsInPlay(
            (card) => card.getType() === 'character' && !card.hasTrait(traitName)
        );

        this.game.addMessage(
            '{0} is forced by {1} to kill characters they control without the {2} trait',
            player,
            this,
            traitName
        );

        if (characters.length > 0) {
            this.game.killCharacters(characters, { allowSave: false });
        }

        return true;
    }
}

VanquishTheUnbelievers.code = '12052';

module.exports = VanquishTheUnbelievers;
