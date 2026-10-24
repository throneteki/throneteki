import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BearIslandHost extends DrawCard {
    // Bear Island Host (06021)
    // Bestow (3). No attachments.
    // Action: Discard 1 gold from Bear Island Host to choose a House Mormont character. Until the
    // end of the phase, that character does not kneel when declared as an attacker in a [military]
    // challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard 1 gold from ' + this.name,
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('House Mormont') &&
                    card.getType() === 'character'
            },
            message:
                '{player} discards a gold from {source} to make {target} not kneel as an attacker in a military challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })
            }))
        });
    }
}

BearIslandHost.code = '06021';

export default BearIslandHost;
