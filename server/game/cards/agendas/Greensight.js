const AgendaCard = require('../../agendacard.js');

class Greensight extends AgendaCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'draw'
            },
            handler: () => {
                for(let player of this.game.getPlayers()) {
                    let card = player.drawDeck.first();
                    this.game.addMessage('{0} is forced by {1} to reveal {2} from {3}\'s deck', this.controller, this, card, player);
                }

                if(this.controller.faction.kneeled) {
                    return true;
                }

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Kneel faction card to discard cards?',
                        buttons: [
                            { text: 'Yes', method: 'discard' },
                            { text: 'No', method: 'cancel' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    discard() {
        this.controller.kneelCard(this.controller.faction);

        for(let player of this.game.getPlayers()) {
            player.discardFromDraw(1);
        }

        this.game.addMessage('{0} uses {1} and kneels their faction card to have revealed cards discarded', this.controller, this);

        return true;
    }

    cancel() {
        return true;
    }
}

Greensight.code = '08079';

module.exports = Greensight;
