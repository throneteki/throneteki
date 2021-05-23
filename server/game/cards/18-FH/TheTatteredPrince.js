const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');

class TheTatteredPrince extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardPlaced: event => event.location === 'revealed plots' &&
                        event.player === this.controller
            },
            handler: context => {
                if(!this.hasToken(Tokens.gold)) {
                    context.player.putIntoShadows(this, false);
                    this.game.addMessage('{0} is forced by {1} to return {1} to shadows', this.controller, this);
                    return;
                }

                this.context = context;

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Discard a gold from ' + this.name + '?',
                        buttons: [
                            { text: 'Yes', method: 'discardGold' },
                            { text: 'No', method: 'returnToShadows' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    discardGold() {
        this.modifyToken(Tokens.gold, -1);
        this.game.addMessage('{0} is forced to discard a gold from {1}', this.controller, this);

        return true;
    }

    returnToShadows() {
        this.context.player.putIntoShadows(this, false);
        this.game.addMessage('{0} uses {1} to return {1} to shadows', this.context.player, this);

        return true;
    }
}

TheTatteredPrince.code = '18008';

module.exports = TheTatteredPrince;
