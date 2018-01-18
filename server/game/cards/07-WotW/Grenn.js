const DrawCard = require('../../drawcard.js');

class Grenn extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this) &&
                    event.challenge.loser.faction.power > 0)
            },
            target: {
                cardCondition: card => (
                    card.location === 'play area' &&
                    card !== this &&
                    this.game.currentChallenge.isAttacking(card) &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character')
            },
            handler: context => {
                var otherPlayer = context.event.challenge.loser;
                var power = otherPlayer.faction.power > 1 && context.target.kneeled === false ? 2 : 1;
                this.game.movePower(otherPlayer.faction, context.target, power);

                this.game.addMessage('{0} uses {1} to move {2} power from {3}\'s faction to {4}',
                    this.controller, this, power, otherPlayer, context.target);
            }
        });
    }
}

Grenn.code = '07010';

module.exports = Grenn;
