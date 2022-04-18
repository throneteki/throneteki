const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class SerJaimeLannister extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => this.kneeled && this.game.currentPhase === 'challenge' && event.card.getType() === 'character'
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.standCard({ card: this }), 
                    context
                ).thenExecute(() => {
                    context.event.card.controller.discardCard(context.event.card);
                    this.game.addMessage('{0} stands {1} and discards {2} from play', this.controller, this, context.event.card);
                });
            }
        });
    }
}

SerJaimeLannister.code = '22007';

module.exports = SerJaimeLannister;
