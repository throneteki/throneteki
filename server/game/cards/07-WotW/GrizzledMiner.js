import DrawCard from '../../drawcard.js';

class GrizzledMiner extends DrawCard {
    // Grizzled Miner (07006)
    // No attachments except Weapon.
    // Reduce the cost to marshal Grizzled Miner by 1 for each [thenightswatch] attachment and
    // location you control (to a minimum of 1).
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: [
                ability.effects.reduceSelfCost('marshal', (card) =>
                    card.controller.getNumberOfCardsInPlay(
                        (controlledCard) =>
                            controlledCard.isFaction('thenightswatch') &&
                            ['attachment', 'location'].includes(controlledCard.getType())
                    )
                ),
                ability.effects.setMinCost(1)
            ]
        });
    }
}

GrizzledMiner.code = '07006';

export default GrizzledMiner;
