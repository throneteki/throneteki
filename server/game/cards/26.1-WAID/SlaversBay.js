import DrawCard from '../../drawcard.js';

class SlaversBay extends DrawCard {
    setupCardAbilities(ability) {
        const killDuringChallengePersistentEffect = ({ challengeType, location }) => {
            this.persistentEffect({
                condition: () =>
                    this.game.isDuringChallenge({ challengeType }) &&
                    this.controller.anyCardsInPlay({ name: location }),
                match: (card) => card.isParticipating(),
                effect: ability.effects.killIf((card) => card.getStrength() === 0),
                targetController: 'any'
            });
        };

        killDuringChallengePersistentEffect({ challengeType: 'military', location: 'Astapor' });
        killDuringChallengePersistentEffect({ challengeType: 'intrigue', location: 'Yunkai' });
        killDuringChallengePersistentEffect({ challengeType: 'power', location: 'Meereen' });
    }
}

SlaversBay.code = '26014';

export default SlaversBay;
