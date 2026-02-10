import DrawCard from '../../drawcard.js';

class WarElephants extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', () =>
                this.controller.getNumberOfCardsInPlay({ type: 'character', trait: 'Commander' })
            )
        });
        this.persistentEffect({
            targetController: 'current',
            targetLocation: 'hand',
            effect: [
                ability.effects.cannotMarshal((card) => card === this),
                ability.effects.cannotSetup((card) => card === this)
            ]
        });
    }
}

WarElephants.code = '26113';

export default WarElephants;
