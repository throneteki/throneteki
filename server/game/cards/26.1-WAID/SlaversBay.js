import DrawCard from '../../drawcard.js';

class SlaversBay extends DrawCard {
    // Slaver's Bay (26014)
    // Each participating character is killed if its STR is 0 during:
    // - [military] challenges, if you control Astapor.
    // - [intrigue] challenges, if you control Yunkai.
    // - [power] challenges, if you control Meereen.
    setupCardAbilities(ability) {
        for (const [challengeType, location] of [
            ['military', 'Astapor'],
            ['intrigue', 'Yunkai'],
            ['power', 'Meereen']
        ]) {
            this.persistentEffect({
                condition: (context) =>
                    context.game.isDuringChallenge({ challengeType }) &&
                    context.source.controller.anyCardsInPlay({ name: location }),
                match: (card) => card.isParticipating(),
                effect: ability.effects.killIf((card) => card.getStrength() === 0),
                targetController: 'any'
            });
        }
    }
}

SlaversBay.code = '26014';

export default SlaversBay;
