import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Highgarden extends DrawCard {
    // Highgarden (22023)
    // Action: Kneel Highgarden to reveal up to 3 [tyrell] characters from your hand. For each card
    // revealed this way, choose a character. Until the end of the phase, that character gets +2
    // STR. (You may choose the same character more than once.)
    // Challenges Action: Return a unique [tyrell] character you control to your hand. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Give characters +STR',
            cost: ability.costs.kneelSelf(),
            target: {
                type: 'select',
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select up to 3 cards',
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'hand' &&
                    card.isFaction('tyrell') &&
                    card.getType() === 'character',
                gameAction: 'reveal'
            },
            message: '{player} kneels {costs.kneel} to reveal {target} from their hand',
            gameAction: GameActions.revealCards((context) => ({
                player: context.player,
                cards: context.target
            })).then((preThenContext) => ({
                gameAction: GameActions.simultaneously(
                    preThenContext.target.map(() =>
                        GameActions.chooseCards({
                            title: 'Select a character to get +2 STR',
                            cardCondition: { location: 'play area', type: 'character' },
                            gameAction: (card) =>
                                GameActions.lastingEffect(() => ({
                                    duration: 'untilEndOfPhase',
                                    match: card,
                                    effect: ability.effects.modifyStrength(2)
                                }))
                        })
                    )
                )
            }))
        });
        this.action({
            title: 'Return character to hand',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    card.isFaction('tyrell') &&
                    card.isUnique()
            },
            message: '{player} uses {source} to return {target} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

Highgarden.code = '22023';

export default Highgarden;
