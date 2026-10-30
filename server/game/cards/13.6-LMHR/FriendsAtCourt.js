import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FriendsAtCourt extends DrawCard {
    // Friends at Court (13115)
    // Shadow (2).
    // Reaction: After Friends at Court comes out of shadows, look at up to 3 cards in shadows.
    // Then, you may pay 2 gold to choose 1 of those cards and return it to its owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                type: 'select',
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select up to 3 cards',
                cardCondition: (card) => card.location === 'shadows'
            },
            message: '{player} uses {source} to look at up to 3 cards in shadows',
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.player.getSpendableGold({
                        player: context.player,
                        playingType: 'ability'
                    }) >= 2,
                thenAction: GameActions.chooseCards({
                    optional: true,
                    revealTargets: true,
                    title: "Pay 2 gold to return a card to its owner's hand?",
                    cardCondition: (card, context) => context.target.includes(card),
                    gameAction: (card, context) =>
                        GameActions.simultaneously([
                            GameActions.payGold({ player: context.player, amount: 2 }),
                            GameActions.returnCardToHand({ card })
                        ])
                }),
                elseAction: GameActions.lookAtCards((context) => ({
                    player: context.player,
                    cards: context.target
                }))
            })
        });
    }
}

FriendsAtCourt.code = '13115';

export default FriendsAtCourt;
