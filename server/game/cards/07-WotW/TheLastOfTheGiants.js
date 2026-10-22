import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheLastOfTheGiants extends DrawCard {
    // "The Last of the Giants" (07045)
    // Action: Put a neutral character into play from your hand. Until the end of the phase, that
    // character gains intimidate. At the end of the phase, if that character is still in play, kill
    // it (cannot be saved).
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('neutral') &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play from their hand',
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.target
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.target,
                    effect: ability.effects.addKeyword('Intimidate')
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

TheLastOfTheGiants.code = '07045';

export default TheLastOfTheGiants;
