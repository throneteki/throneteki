import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWhisperingSound extends DrawCard {
    // The Whispering Sound (26056)
    // Shadow (1).
    // Reaction: After a location enters play during the challenges phase, kneel The Whispering
    // Sound to draw 2 cards. Then, choose a card in your hand and place it on top of your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    this.game.currentPhase === 'challenge' && event.card.getType() === 'location'
            },
            cost: ability.costs.kneelSelf(),
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 2
            })).then({
                target: {
                    activePromptTitle: 'Select a card',
                    cardCondition: { location: 'hand', controller: 'current' }
                },
                message: 'Then {player} places a card on top of their deck',
                handler: (context) => {
                    this.game.resolveGameAction(
                        GameActions.returnCardToDeck((context) => ({
                            card: context.target
                        })),
                        context
                    );
                }
            })
        });
    }
}

TheWhisperingSound.code = '26056';

export default TheWhisperingSound;
