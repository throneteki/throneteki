import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BrightwaterHost extends DrawCard {
    // Brightwater Host (11083)
    // No attachments.
    // Reaction: After you win a challenge in which Brightwater Host is attacking, choose 1 card in
    // shadows and return it to its owner's hand. Then, a unique [tyrell] character you control
    // gains 2 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isAttacking(context.source)
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) => card.location === 'shadows'
            },
            message: {
                format: "{player} uses {source} to return one of {owner}'s cards in shadows to their hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target })).then({
                target: {
                    cardCondition: (card, context) =>
                        card.controller === context.player &&
                        card.getType() === 'character' &&
                        card.location === 'play area' &&
                        card.isFaction('tyrell') &&
                        card.isUnique(),
                    gameAction: 'gainPower'
                },
                message: 'Then {player} has {target} gain 2 power',
                gameAction: GameActions.gainPower((context) => ({
                    card: context.target,
                    amount: 2
                }))
            })
        });
    }
}

BrightwaterHost.code = '11083';

export default BrightwaterHost;
