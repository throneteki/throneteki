import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CoastalReaver extends DrawCard {
    // Coastal Reaver (08071)
    // Reaction: After Coastal Reaver enters play, choose an opponent. That player chooses a card in
    // his or her hand and places it on top of his or her deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            chooseOpponent: (opponent) => opponent.hand.length > 0,
            message: '{player} uses {source} to choose {opponent}',
            gameAction: GameActions.chooseCards({
                player: (context) => context.opponent,
                title: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.returnCardToDeck({ card })
            })
        });
    }
}

CoastalReaver.code = '08071';

export default CoastalReaver;
