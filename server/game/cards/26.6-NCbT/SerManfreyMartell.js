import DrawCard from '../../drawcard.js';

class SerManfreyMartell extends DrawCard {
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
