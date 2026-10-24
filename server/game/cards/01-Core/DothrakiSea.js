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
                GameActions.delayedEffect((context) => {
                    const card = context.target;
                    return {
                        duration: 'untilTriggered',
                        title: card.name,
                        when: { onAtEndOfPhase: () => true },
                        until: { onCardLeftPlay: (event) => event.card === card },
                        gameAction: GameActions.ifCondition({
                            condition: () => ['play area', 'duplicate'].includes(card.location),
                            thenAction: {
                                message:
                                    '{player} resolves the delayed effect from {source}: {gameAction}',
                                gameAction: GameActions.returnCardToHand({ card, allowSave: false })
                            }
                        })
                    };
                })
            ])
        });
    }
}

DothrakiSea.code = '01174';

export default DothrakiSea;
