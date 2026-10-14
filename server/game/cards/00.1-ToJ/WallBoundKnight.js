import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/Tokens.js';

class WallBoundKnight extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card === this && this.game.currentPhase === 'challenge'
            },
            target: {
                // TODO BD faction card = gold pool is ambiguous
                // with cards that can put gold on the faction card
                activePromptTitle: 'Select a card (faction card = gold pool)',
                cardCondition: (card) =>
                    ['active plot', 'faction', 'play area'].includes(card.location) &&
                    card.controller !== this.controller &&
                    (card.hasToken(Tokens.gold) ||
                        (card.getType() === 'faction' && card.controller.gold >= 1)),
                cardType: ['character', 'location', 'attachment', 'faction']
            },
            handler: (context) => {
                // Prefer stealing from gold pool even if faction card has gold
                if (context.target.getType() === 'faction' && context.target.controller.gold >= 1) {
                    this.moveGoldFromGoldPool(context);
                } else if (context.target.hasToken(Tokens.gold)) {
                    this.moveGoldFromCard(context);
                }
            }
        });
    }

    moveGoldFromCard(context) {
        this.game.transferGold({
            from: context.target,
            to: context.player,
            amount: 1
        });
        this.game.addMessage(
            '{0} uses {1} to move 1 gold from {2} to their gold pool',
            context.player,
            this,
            context.target
        );
    }

    moveGoldFromGoldPool(context) {
        this.game.transferGold({
            from: context.target.controller,
            to: context.player,
            amount: 1
        });
        this.game.addMessage(
            "{0} uses {1} to move 1 gold from {2}'s gold pool to their own",
            context.player,
            this,
            context.target.controller
        );
    }
}

WallBoundKnight.code = '00217';

export default WallBoundKnight;
