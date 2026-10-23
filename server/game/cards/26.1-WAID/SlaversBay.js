import DrawCard from '../../drawcard.js';

class SlaversBay extends DrawCard {
    // Slaver's Bay (26014)
    // Each participating character is killed if its STR is 0 during:
    // - [military] challenges, if you control Astapor.
    // - [intrigue] challenges, if you control Yunkai.
    // - [power] challenges, if you control Meereen.
    setupCardAbilities(ability) {
        const killDuringChallengePersistentEffect = ({ challengeType, location }) => {
            this.persistentEffect({
                condition: (context) =>
                    context.game.isDuringChallenge({ challengeType }) &&
                    context.source.controller.anyCardsInPlay({ name: location }),
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
