const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class TheHalfmansHorde extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isAttacking()
            },
            message: {
                format: '{player} uses {source} to discard {number} cards at random from {loser}\'s hand',
                args: { 
                    number: context => this.getNumberOfUniqueAttackingClansman(context.event.challenge.winner),
                    loser: context => context.event.challenge.loser
                }
            },
            gameAction: GameActions.discardAtRandom(context => ({ player: context.event.challenge.loser, amount: this.getNumberOfUniqueAttackingClansman(context.event.challenge.winner) }))
        });
    }

    getNumberOfUniqueAttackingClansman(player) {
        return player.getNumberOfCardsInPlay(card => card.isUnique() && card.isAttacking() && card.hasTrait('Clansman') && card.getType() === 'character');
    }
}

TheHalfmansHorde.code = '23005';

module.exports = TheHalfmansHorde;
