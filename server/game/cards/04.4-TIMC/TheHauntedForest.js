const DrawCard = require('../../drawcard.js');

class TheHauntedForest extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                !this.kneeled &&
                this.game.isDuringChallenge({ defendingPlayer: this.controller })
            ),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
        this.forcedReaction({
            when: {
                afterChallenge: event => this.controller === event.challenge.loser && !this.kneeled
            },
            handler: () => {
                this.game.addMessage('{0} is forced to kneel {1}', this.controller, this);
                this.controller.kneelCard(this);
            }
        });
    }
}

TheHauntedForest.code = '04066';

module.exports = TheHauntedForest;
