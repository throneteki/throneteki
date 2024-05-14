import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RickardKarstark extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice character or location',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.hasTrait('The North')
            ),
            target: {
                type: 'select',
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Select a character or location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    (card.getType() === 'character' || card.getType() === 'location')
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

        this.reaction({
            when: {
                onPlotsRevealed: (event) => event.plots.some((plot) => plot.hasTrait('Winter'))
            },
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.player &&
                    card.hasTrait('The North') &&
                    card.getType() === 'location'
            },
            handler: (context) => {
                context.player.moveCard(context.target, 'hand');
                this.game.addMessage(
                    '{0} uses {1} to move {2} from their discard pile to their hand',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

RickardKarstark.code = '18011';

export default RickardKarstark;
