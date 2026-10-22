import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Kingsmoot extends DrawCard {
    // Kingsmoot (08052)
    // Reaction: After you win dominance, choose a unique [greyjoy] character you control. That
    // character gains 1 power for each unique [greyjoy] character you control. (Max 1 per round.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perRound(1),
            when: {
                onDominanceDetermined: (event, context) =>
                    context.source.controller === event.winner
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.isUnique() &&
                    card.isFaction('greyjoy') &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            message: {
                format: '{player} plays {source} to have {target} gain {amount} power',
                args: {
                    amount: (context) =>
                        context.player.getNumberOfCardsInPlay(
                            (card) =>
                                card.isUnique() &&
                                card.isFaction('greyjoy') &&
                                card.getType() === 'character'
                        )
                }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.target,
                amount: context.player.getNumberOfCardsInPlay(
                    (card) =>
                        card.isUnique() &&
                        card.isFaction('greyjoy') &&
                        card.getType() === 'character'
                )
            }))
        });
    }
}

Kingsmoot.code = '08052';

export default Kingsmoot;
