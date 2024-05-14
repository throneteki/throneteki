import DrawCard from '../../drawcard.js';

class TyrionLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.initiatedChallengeType === 'intrigue' &&
                    this.controller.canGainGold()
            },
            limit: ability.limit.perRound(2),
            handler: () => {
                let gold = this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, gold);
            }
        });
    }
}

TyrionLannister.code = '01089';

export default TyrionLannister;
