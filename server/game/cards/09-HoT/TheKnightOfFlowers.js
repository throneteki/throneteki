import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheKnightOfFlowers extends DrawCard {
    // The Knight of Flowers (09007)
    // Renown.
    // Reaction: After you play an event, The Knight of Flowers gets +2 STR until the end of the
    // phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) => event.player === context.source.controller
            },
            message: '{player} uses {source} to gain +2 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source,
                effect: ability.effects.modifyStrength(2)
            }))
        });
    }
}

TheKnightOfFlowers.code = '09007';

export default TheKnightOfFlowers;
