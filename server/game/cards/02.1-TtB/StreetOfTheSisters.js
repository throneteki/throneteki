import DrawCard from '../../drawcard.js';

class StreetOfTheSisters extends DrawCard {
    // Street of the Sisters (02018)
    // Reaction: After you win a [power] challenge by 5 or more STR, kneel your faction card to gain
    // 1 power for your faction.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.strengthDifference >= 5 &&
                    this.controller.canGainFactionPower()
            },
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.addPower(this.controller, 1);
                this.game.addMessage(
                    '{0} uses {1} and kneels their faction card to gain 1 power for their faction',
                    this.controller,
                    this
                );
            }
        });
    }
}

StreetOfTheSisters.code = '02018';

export default StreetOfTheSisters;
