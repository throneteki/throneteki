import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RickardKarstark extends DrawCard {
    // Rickard Karstark (18011)
    // Challenges Action: Kneel a The North location to have each player sacrifice a character or
    // location. (Limit once per phase.)
    // Reaction: After a Winter plot card is revealed, return a The North location from your discard
    // pile to your hand. (Limit once per phase.)
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
            message:
                '{player} uses {source} and kneels {costs.kneel} to have each player sacrifice a character or location',
            gameAction: GameActions.simultaneously((context) =>
                context.targets.selections
                    .filter((selection) => !!selection.value)
                    .map((selection) =>
                        GameActions.sacrificeCard({
                            player: selection.choosingPlayer,
                            card: selection.value
                        })
                    )
            )
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
            message:
                '{player} uses {source} to move {target} from their discard pile to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

RickardKarstark.code = '18011';

export default RickardKarstark;
