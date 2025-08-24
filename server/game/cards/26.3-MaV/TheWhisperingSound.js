import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWhisperingSound extends DrawCard {
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
