import DrawCard from '../../drawcard.js';

class SerManfreyMartell extends DrawCard {
    // Ser Manfrey Martell (26107)
    // Renown.
    // While Ser Manfrey Martell is participating in a challenge, insight and renown resolve for the
    // losing player instead of the winning player.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            effect: [
                ability.effects.triggerChallengeKeywordOnLosing('renown'),
                ability.effects.triggerChallengeKeywordOnLosing('insight')
            ]
        });
    }
}

SerManfreyMartell.code = '26107';

export default SerManfreyMartell;
