import DrawCard from '../../drawcard.js';

class TraitorToTheCrown extends DrawCard {
    // Traitor to the Crown (08009)
    // Opponent's character only.
    // Attached character does not contribute its STR to [power] challenges or to its controller's
    // total for dominance.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });

        this.whileAttached({
            effect: ability.effects.doesNotContributeToDominance()
        });

        this.whileAttached({
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'power' }),
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

TraitorToTheCrown.code = '08009';

export default TraitorToTheCrown;
