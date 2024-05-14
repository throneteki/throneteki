import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RamsaySnow extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                let selections = context.targets.selections.filter(
                    (selection) => !!selection.value
                );
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        selections.map((selection) =>
                            GameActions.sacrificeCard({
                                player: selection.choosingPlayer,
                                card: selection.value
                            })
                        )
                    )
                );
            }
        });
    }
}

RamsaySnow.code = '08041';

export default RamsaySnow;
