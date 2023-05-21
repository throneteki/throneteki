const DrawCard = require('../../drawcard');

class TheBastardsLetter extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.isMatch({ initiatedAgainstPlayer: this.controller, initiatedChallengeType: 'military' })
            },
            target: {
                type: 'select',
                mode: 'unlimited',
                optional: true,
                cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.hasIcon('military') && card.kneeled,
                gameAction: 'stand'
            },
            handler: context => {
                let message = context.target.length === 0 ? '{0} plays {1}' : '{0} plays {1} to stand {2}';
                this.game.addMessage(message, context.player, this, context.target);

                for(let card of context.target) {
                    context.player.standCard(card);
                }

                this.game.once('afterChallenge', event => this.killAttackingCharacters(event));
            }
        });
    }

    killAttackingCharacters(event) {
        if(event.challenge.winner !== this.controller) {
            return;
        }

        let attackers = event.challenge.attackers;
        this.game.addMessage('{0} uses {1} to kill {2}', this.controller, this, attackers);
        this.game.killCharacters(attackers);
    }
}

TheBastardsLetter.code = '11102';

module.exports = TheBastardsLetter;
