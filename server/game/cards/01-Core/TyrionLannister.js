import DrawCard from '../../drawcard.js';

class TyrionLannister extends DrawCard {
    // Tyrion Lannister (01089)
    // Stealth.
    // Reaction: After an [intrigue] challenge is initiated, gain 2 gold. (Limit twice per round.)
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
