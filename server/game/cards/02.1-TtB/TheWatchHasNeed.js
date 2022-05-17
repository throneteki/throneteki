const DrawCard = require('../../drawcard.js');

class TheWatchHasNeed extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search for a character',
            condition: () => this.controller.getTotalReserve() > 0,
            message: {
                format: '{player} plays {source} to name a trait and search the top {reserve} cards of their deck',
                args: { reserve: context => context.player.getTotalReserve() }
            },
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a trait',
                        buttons: [
                            { text: 'Builder', method: 'setTrait', arg: 'Builder' },
                            { text: 'Ranger', method: 'setTrait', arg: 'Ranger' },
                            { text: 'Steward', method: 'setTrait', arg: 'Steward' },
                            { text: 'Cancel', method: 'cancelTraitSelection' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    setTrait(player, trait) {
        let reserve = player.getTotalReserve();

        this.game.addMessage('{0} names the {1} trait', player, trait);
        this.game.promptForDeckSearch(this.controller, {
            numCards: reserve,
            numToSelect: reserve, // player can stop earlier clicking Done when happy
            activePromptTitle: 'Select a card',
            cardCondition: card => card.getType() === 'character' && card.hasTrait(trait),
            onSelect: (player, cards, valids) => this.cardsSelected(player, cards, valids),
            onCancel: player => this.doneSelecting(player),
            source: this
        });

        return true;
    }

    cardsSelected(player, cards, valids) {
        if(valids.length > 0) {
            for(let valid of valids) {
                player.moveCard(valid, 'hand');
            }
            this.game.addMessage('{0} adds {1} to their hand',
                player, valids);
    
        }
        return true;
    }

    cancelTraitSelection(player) {
        this.game.addAlert('danger', '{0} cancels the effect of {1}', player, this);

        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);

        return true;
    }
}

TheWatchHasNeed.code = '02002';

module.exports = TheWatchHasNeed;
