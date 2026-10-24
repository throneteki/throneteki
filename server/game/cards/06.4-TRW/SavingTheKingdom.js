import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SavingTheKingdom extends DrawCard {
    // Saving the Kingdom (06068)
    // Challenges Action: Choose and kneel a character with STR 3 or lower. That character cannot
    // stand during the standing phase this round.
    // Reaction: After you win dominance, pay 1 gold to return Saving the Kingdom from your discard
    // pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel and make character unable to stand',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 3,
                gameAction: 'kneel'
            },
            message:
                '{player} plays {source} to kneel and make {target} unable to stand during the standing phase this round',
            gameAction: GameActions.simultaneously([
                GameActions.kneelCard((context) => ({ card: context.target })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfRound',
                    condition: () => context.game.currentPhase === 'standing',
                    match: context.target,
                    effect: ability.effects.cannotBeStood()
                }))
            ])
        });
        this.reaction({
            location: 'discard pile',
            when: {
                onDominanceDetermined: (event, context) => context.player === event.winner
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to return {source} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
        });
    }
}

SavingTheKingdom.code = '06068';

export default SavingTheKingdom;
