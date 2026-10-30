import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldtownUndercity extends DrawCard {
    // Oldtown Undercity (11024)
    // Shadow (2).
    // Reaction: After a card you control comes out of shadows, look at the top 3 cards of your
    // deck. Add 1 to your hand, place 1 on the bottom of your deck, and place the other on top of
    // your deck. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card.controller === context.player
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to look at the top 3 cards of their deck',
            gameAction: GameActions.lookAtDeck((context) => ({
                player: context.player,
                lookingAt: context.player,
                amount: 3
            })).then({
                targets: {
                    hand: {
                        type: 'select',
                        activePromptTitle: 'Choose a card to add to your hand',
                        revealTargets: true,
                        cardCondition: (card, context) => context.event.topCards.includes(card)
                    },
                    bottom: {
                        type: 'select',
                        ifAble: true,
                        activePromptTitle: 'Choose card to place on bottom of deck',
                        revealTargets: true,
                        cardCondition: (card, context) =>
                            context.event.topCards.includes(card) && card !== context.targets.hand
                    }
                },
                message:
                    'Then {player} adds 1 card to their hand, places 1 on the bottom of their deck and the other on top',
                gameAction: GameActions.simultaneously([
                    GameActions.addToHand((context) => ({ card: context.targets.hand })),
                    GameActions.placeCard((context) => ({
                        card: context.targets.bottom,
                        location: 'draw deck',
                        bottom: true
                    }))
                ])
            })
        });
    }
}

OldtownUndercity.code = '11024';

export default OldtownUndercity;
