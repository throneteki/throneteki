const DrawCard = require('../../drawcard.js');

class GlassCandle extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            condition: () => this.parent.hasTrait('Maester'),
            effect: ability.effects.addKeyword('insight')
        });
        this.action({
            title: 'Look at top card',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let players = this.game.getPlayers();

                let buttons = players.map(player => { 
                    return { text: player.name, method: 'chooseToDiscard', arg: player.name };
                });
        
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select a player',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    chooseToDiscard(player, playerName) {
        let selectedPlayer = this.game.getPlayerByName(playerName);
        this.topCard = selectedPlayer.drawDeck[0];
        this.game.addMessage('{0} kneels {1} to look at the top card of {2}\'s deck', this.controller, this, selectedPlayer);

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Discard ' + this.topCard.name + '?',
                buttons: [
                    { text: 'Yes', method: 'discard', card: this.topCard },
                    { text: 'No', method: 'decline', card: this.topCard }
                ]
            },
            source: this
        });

        return true;
    }

    discard() {
        this.topCard.owner.discardFromDraw(1);
        this.game.addMessage('{0} discards {1} from the top of {2}\'s deck', this.controller, this.topCard, this.topCard.owner);
        return true;
    }

    decline() {
        return true;
    }
}

GlassCandle.code = '11059';

module.exports = GlassCandle;
