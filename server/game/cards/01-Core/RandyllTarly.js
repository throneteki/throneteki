import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RandyllTarly extends DrawCard {
    // Randyll Tarly (01183)
    // Renown.
    // Reaction: After Randyll Tarly's STR is increased by a card effect, stand him. (Limit twice
    // per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStrengthChanged: (event, context) =>
                    event.card === context.source &&
                    event.amount > 0 &&
                    event.applying &&
                    context.source.kneeled
            },
            limit: ability.limit.perPhase(2),
            message: '{player} stands {source} due to strength increase',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

RandyllTarly.code = '01183';

export default RandyllTarly;
