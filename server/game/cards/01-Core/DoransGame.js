import DrawCard from '../../drawcard.js';

class DoransGame extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.strengthDifference >= 5 &&
                    this.controller.canGainFactionPower()
            },
            handler: () => {
                let power = this.controller.getNumberOfUsedPlots();
                this.game.addPower(this.controller, power);
                this.game.addMessage(
                    '{0} plays {1} to gain {2} power for their faction',
                    this.controller,
                    this,
                    power
                );
            }
        });
    }
}

DoransGame.code = '01119';

export default DoransGame;
