import DrawCard from '../../drawcard.js';

class Kingswood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({
                    challengeType: 'power',
                    defendingPlayer: this.controller
                }),
            match: (card) => card.isAttacking(),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });

        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.challengeType === 'power'
            },
            handler: () => {
                this.game.addMessage('{0} is forced to sacrifice {1}', this.controller, this);
                this.controller.sacrificeCard(this);
            }
        });
    }
}

Kingswood.code = '02087';

export default Kingswood;
