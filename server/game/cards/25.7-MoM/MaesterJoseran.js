const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class MaesterJoseran extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onFirstPlayerDetermined: event =>
                    this.controller === event.player &&
                    this.game.getPlayers().every(player => player.agenda)
            },
            message: '{player} uses {source} to have each player put the top card of their decks under their agenda',
            handler: context => {
                const topCards = this.game.getPlayers().map(player => player.drawDeck.slice(0, 1));
                this.game.resolveGameAction(GameActions.simultaneously(() => topCards.map(card => GameActions.placeCard({ player: card.controller, card, location: 'conclave' }))), context);
            }
        });
    }
}

MaesterJoseran.code = '15041';
MaesterJoseran.version = '1.0';

module.exports = MaesterJoseran;
