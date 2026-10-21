import DrawCard from '../../drawcard.js';

class RedKeepServant extends DrawCard {
    // Red Keep Servant (26021)
    // While you control a King's Landing location, Red Keep Servant gains an [intrigue] icon and
    // cannot be bypassed by stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay({
                    type: 'location',
                    trait: "King's Landing"
                }),
            match: this,
            effect: [
                ability.effects.addIcon('intrigue'),
                ability.effects.cannotBeBypassedByStealth()
            ]
        });
    }
}

RedKeepServant.code = '26021';

export default RedKeepServant;
