const DrawCard = require('../../drawcard.js');
const {flatMap} = require('../../../Array');

class TheDrownedGodWakes extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: event => this.controller === event.winner && event.difference >= 15
            },
            cost: ability.costs.kneelFactionCard(),
            message: '{player} uses {source} and kneels their faction card to kill each character',
            handler: () => {
                // TODO: Fix VM issue to conver that & this card into gameaction
                let players = this.game.getPlayersInFirstPlayerOrder();
                let characters = flatMap(players, player => player.filterCardsInPlay(card => card.getType() === 'character'));
                this.game.killCharacters(characters);
            }
        });
    }
}

TheDrownedGodWakes.code = '25523';
TheDrownedGodWakes.version = '1.1';

module.exports = TheDrownedGodWakes;
