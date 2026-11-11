import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NoSurprises extends DrawCard {
    // No Surprises (13022)
    // Action: Reveal your hand (of at least 1 card). Then, until the end of the phase, each
    // opponent cannot play events or bring cards out of shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal your hand',
            condition: (context) => context.player.hand.length > 1,
            message: '{player} plays {source} to reveal their hand',
            gameAction: GameActions.revealCards((context) => ({
                player: context.player,
                cards: context.player.hand
            })).then({
                message: {
                    format: 'Then, until the end of the phase, {opponents} cannot play events or bring cards out of shadows',
                    args: { opponents: (context) => context.game.getOpponents(context.player) }
                },
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'any',
                    match: (player) => player !== context.player,
                    effect: [
                        ability.effects.cannotPutIntoPlay((card) => card.location === 'shadows'),
                        ability.effects.cannotPlay((card) => card.getPrintedType() === 'event')
                    ]
                }))
            })
        });
    }
}

NoSurprises.code = '13022';

export default NoSurprises;
