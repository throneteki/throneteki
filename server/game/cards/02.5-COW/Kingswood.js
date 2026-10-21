import DrawCard from '../../drawcard.js';

class Kingswood extends DrawCard {
    // Kingswood (02087)
    // During [power] challenges in which you are the defending player, each attacking character
    // gets -1 STR.
    // Forced Reaction: After you lose a [power] challenge, sacrifice Kingswood.
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
