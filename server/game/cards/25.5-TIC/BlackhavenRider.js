import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackhavenRider extends DrawCard {
    // Blackhaven Rider (25081)
    // Reaction: After Blackhaven Rider enters play, each player must choose and kneel a loyal
    // character they control, if able.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    card.isLoyal()
            },
            handler: (context) => {
                let selections = context.targets.selections.filter(
                    (selection) => !!selection.value
                );
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        selections.map((selection) =>
                            GameActions.kneelCard({
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

BlackhavenRider.code = '25081';

export default BlackhavenRider;
