import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KnightsOfTheMind extends DrawCard {
    // Knights of the Mind (13078)
    // Challenge Action: Until the end of the phase, each Maester character you control gains a
    // [military] icon.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give each Maester character you control a military icon',
            message:
                '{player} plays {source} to give each Maester character a military icon until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.player.filterCardsInPlay(
                    (card) => card.getType() === 'character' && card.hasTrait('Maester')
                ),
                effect: ability.effects.addIcon('military')
            }))
        });
    }
}

KnightsOfTheMind.code = '13078';

export default KnightsOfTheMind;
