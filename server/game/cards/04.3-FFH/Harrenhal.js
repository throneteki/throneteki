import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Harrenhal extends DrawCard {
    // Harrenhal (04050)
    // Challenges Action: Kneel Harrenhal to put a [lannister] or House Bolton character into play
    // from your hand. At the end of the phase, if that character is still in play, kill it (cannot
    // be saved).
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            cost: ability.costs.kneelSelf(),
            phase: 'challenge',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    (card.isFaction('lannister') || card.hasTrait('House Bolton')) &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} kneels {source} to put {target} into play from their hand',
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.target
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'atEndOfPhase',
                    match: context.target,
                    condition: () => 'play area' === context.target.location,
                    effect: ability.effects.killIfStillInPlay(false)
                }))
            ])
        });
    }
}

Harrenhal.code = '04050';

export default Harrenhal;
