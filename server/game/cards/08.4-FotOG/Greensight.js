const AgendaCard = require('../../agendacard.js');
const GameActions = require('../../GameActions');

class Greensight extends AgendaCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'draw'
            },
            message: '{player} is forced by {source} to reveal the top cards of each player\'s deck',
            gameAction: GameActions.revealCards(context => ({
                cards: context.game.getPlayers().map(player => player.drawDeck[0]),
                player: context.player,
                whileRevealed: GameActions.may({
                    title: 'Kneel faction card to discard cards?',
                    gameAction: GameActions.kneelCard(context => ({
                        card: context.player.faction
                    })).then({
                        handler: () => {
                            this.discard();
                        }
                    })
                })
            }))
        });
    }

    discard() {
        // TODO: This cannot be re-implemented as simultaneous game actions until Tywin LoCR is re-implemented to
        // look at cards discard from a specific player's deck.
        for(let player of this.game.getPlayers()) {
            player.discardFromDraw(1);
        }

        this.game.addMessage('{0} kneels their faction card to discard the revealed cards', this.controller, this);
    }
}

Greensight.code = '08079';

module.exports = Greensight;
