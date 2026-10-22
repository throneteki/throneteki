import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DothrakiSea extends DrawCard {
    // Dothraki Sea (01174)
    // Reaction: After you win a [power] challenge, sacrifice Dothraki Sea to put a Dothraki
    // character into play from your hand. At the end of the phase, if that card is still in play,
    // return it to your hand (cannot be saved).
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'power'
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    card.controller === context.player &&
                    card.hasTrait('Dothraki') &&
                    context.player.canPutIntoPlay(card)
            },
            message: '{player} sacrifices {source} to put {target} into play from their hand',
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.target.controller,
                    card: context.target
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'atEndOfPhase',
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.returnToHandIfStillInPlay()
                }))
            ])
        });
    }
}

DothrakiSea.code = '01174';

export default DothrakiSea;
