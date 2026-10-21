import DrawCard from '../../drawcard.js';

class WarElephants extends DrawCard {
    // War Elephants (26113)
    // Ambush (8). Intimidate. No attachments.
    // Reduce the cost to ambush War Elephants by 1 for each Commander character you control.
    // War Elephants cannot be marshaled or placed during setup.
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
