import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class OldtownInformer extends DrawCard {
    // Oldtown Informer (17138)
    // Ambush (2). Bestow (3).
    // Reaction: After a card enters play during the challenges phase, draw X cards. Then, discard X
    // cards. X is the number of gold Oldtown Informer has. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    context.game.currentPhase === 'challenge' && informerGold(context) >= 1
            },
            limit: ability.limit.perPhase(2),
            message: {
                format: '{player} uses {source} to draw {amount}',
                args: { amount: (context) => TextHelper.count(informerGold(context), 'card') }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: informerGold(context)
            })).then({
                gameAction: GameActions.chooseCards({
                    mode: 'exactly',
                    numCards: (context) => informerGold(context),
                    title: (context) => `Select ${informerGold(context)} cards to discard`,
                    cardCondition: (card, context) =>
                        card.location === 'hand' && card.controller === context.player,
                    gameAction: (card) => GameActions.discardCard({ card })
                })
            })
        });
    }
}

function informerGold(context) {
    return context.source.tokens[Tokens.gold] || 0;
}

OldtownInformer.code = '17138';

export default OldtownInformer;
