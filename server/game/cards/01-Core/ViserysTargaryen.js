import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ViserysTargaryen extends DrawCard {
    // Viserys Targaryen (01167)
    // Interrupt: When Viserys Targaryen leaves play, choose an attachment, and discard it from
    // play.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeftPlay: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'attachment'
            },
            message: '{player} uses {source} to discard {target}',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

ViserysTargaryen.code = '01167';

export default ViserysTargaryen;
