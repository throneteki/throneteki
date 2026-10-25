import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ArchmaestersKey extends DrawCard {
    // Archmaester's Key (08001)
    // Maester character only.
    // Action: Kneel attached character to choose an event in an opponent's discard pile. Once this
    // phase, you may play that event as if it were in your hand. If you do, place it on the bottom
    // of its owner's deck instead of placing it in that player's discard pile.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Maester' });

        this.action({
            title: "Play an event from an opponent's discard pile",
            cost: ability.costs.kneelParent(),
            limit: ability.limit.perPhase(1),
            target: {
                type: 'select',
                location: 'discard pile',
                controller: 'opponent',
                cardCondition: (card, context) =>
                    card.getType() === 'event' &&
                    card.location === 'discard pile' &&
                    card.controller !== context.player
            },
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'current',
                    effect: ability.effects.canPlay((card) => card === context.target)
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'any',
                    targetLocation: 'any',
                    match: (card) => card === context.target,
                    effect: ability.effects.setEventPlacementLocation('draw deck', true)
                }))
            ])
        });
    }
}

ArchmaestersKey.code = '08001';

export default ArchmaestersKey;
