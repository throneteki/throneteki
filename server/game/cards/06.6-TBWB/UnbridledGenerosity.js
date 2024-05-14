import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class UnbridledGenerosity extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put gold on cards',
            target: {
                activePromptTitle: 'Select up to 3 cards',
                cardCondition: (card) => card.location === 'play area',
                numCards: '3',
                multiSelect: true
            },
            handler: (context) => {
                for (let card of context.target) {
                    card.modifyToken(Tokens.gold, 1);
                }

                this.game.addMessage(
                    '{0} plays {1} to move 1 gold from the treasury to {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

UnbridledGenerosity.code = '06118';

export default UnbridledGenerosity;
