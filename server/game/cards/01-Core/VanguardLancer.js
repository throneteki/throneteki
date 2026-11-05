import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VanguardLancer extends DrawCard {
    // Vanguard Lancer (01057)
    // Reaction: After Vanguard Lancer enters play, choose an opponent's character or faction card,
    // and discard 1 power from that card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.controller !== context.source.controller && card.getPower() > 0,
                cardType: ['character', 'faction']
            },
            message: '{player} uses {source} to remove 1 power from {target}',
            gameAction: GameActions.discardPower((context) => ({ card: context.target, amount: 1 }))
        });
    }
}

VanguardLancer.code = '01057';

export default VanguardLancer;
