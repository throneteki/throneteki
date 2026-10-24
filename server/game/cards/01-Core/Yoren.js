import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Yoren extends DrawCard {
    // Yoren (01129)
    // Reaction: After you marshal Yoren, choose a character with printed cost 3 or lower in an
    // opponent's discard pile, and put it into play under your control.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.owner !== context.source.controller &&
                    card.getPrintedCost() <= 3 &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: {
                format: "{player} uses {source} to put {target} into play from {owner}'s discard pile under their control",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

Yoren.code = '01129';

export default Yoren;
