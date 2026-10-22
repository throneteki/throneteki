import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BalonGreyjoy extends DrawCard {
    // Balon Greyjoy (12001)
    // Pillage. Renown.
    // Action: Kneel your faction card to choose a card in an opponent's discard pile and put it
    // into play under your control. At the end of the phase, if that card is still in play, shuffle
    // it into its owner's deck.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put card into play',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller !== context.source.controller &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: {
                format: "{player} uses {source} and kneels their faction card to put {target} into play from {targetOwner}'s discard pile under their control",
                args: {
                    targetOwner: (context) => context.target.owner
                }
            },
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.target
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'atEndOfPhase',
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.shuffleIntoDeckIfStillInPlay()
                }))
            ])
        });
    }
}

BalonGreyjoy.code = '12001';

export default BalonGreyjoy;
