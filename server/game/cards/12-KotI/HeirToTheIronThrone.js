const PlotCard = require('../../plotcard');

class HeirToTheIronThrone extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.getType() === 'character' && ['Lord', 'Lady'].some(trait => card.hasTrait(trait)) && context.player.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);
        let dupeCard = player.getDuplicateInPlay(card);
        player.putIntoPlay(card);
        //only prompt for sacrifice if the card put into play wasn´t a duplicate
        if(!dupeCard) {
            this.game.queueSimpleStep(() => {
                this.promptForSacrifice(player);
            });
        } else {
            this.game.addMessage('{0} can not sacrifice a character because {1} is put into play as a duplicate', player, card);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into play', player, this);
    }

    promptForSacrifice(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => card.location === 'play area' && card.controller === player && ['Lord', 'Lady'].some(trait => card.hasTrait(trait)) && card.allowGameAction('sacrifice'),
            source: this,
            onSelect: (_, card) => {
                this.game.addMessage('Then {0} sacrifices {1}', player, card);
                player.sacrificeCard(card);

                return true;
            },
            onCancel: () => {
                if(!player.anyCardsInPlay(card => ['Lord', 'Lady'].some(trait => card.hasTrait(trait)))) {
                    return;
                }

                this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);

                return true;
            }
        });
    }
}

HeirToTheIronThrone.code = '12048';

module.exports = HeirToTheIronThrone;
