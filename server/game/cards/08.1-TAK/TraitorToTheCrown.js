import DrawCard from '../../drawcard.js';

class TraitorToTheCrown extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });

        this.whileAttached({
            effect: ability.effects.doesNotContributeToDominance()
        });

        this.whileAttached({
            condition: () => this.game.isDuringChallenge({ challengeType: 'power' }),
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

TraitorToTheCrown.code = '08009';

export default TraitorToTheCrown;
