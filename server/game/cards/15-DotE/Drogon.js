const DrawCard = require('../../drawcard.js');

class Drogon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isAttacking()
            },
            handler: context => {
                let characters = this.game.currentChallenge.defendingPlayer.filterCardsInPlay(card => card.getType() === 'character' && card.getStrength() <= 1);
                this.game.killCharacters(characters);

                this.game.addMessage('{0} uses {1} to kill all characters {2} controls with STR 1 or lower',
                    context.player, this, this.game.currentChallenge.defendingPlayer);
            }
        });
    }
}

Drogon.code = '15002';

module.exports = Drogon;
