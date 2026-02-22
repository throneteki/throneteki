import DrawCard from '../../drawcard.js';

class IronFleetDetatchment extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Treat as character',
            cost: ability.costs.payGold(1),
            message:
                '{player} pays 1 gold to treat {source} as a character until the end of the phase',
            handler: () => {
                this.untilEndOfPhase((ability) => ({
                    match: this,
                    effect: [
                        ability.effects.setCardType('character'),
                        ability.effects.addKeyword('stealth'),
                        ability.effects.addTrait('Raider'),
                        ability.effects.modifyStrength(2),
                        ability.effects.addIcon('military'),
                        ability.effects.addIcon('power')
                    ]
                }));
            }
        });
    }
}

IronFleetDetatchment.code = '27522';
IronFleetDetatchment.version = '1.0.0';

export default IronFleetDetatchment;
