import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import Messages from '../../Messages/index.js';

class ShadowOfTheIsles extends DrawCard {
    // Shadow of the Isles (13072)
    // Shadow (1).
    // Action: Each player chooses a non-limited location he or she controls and discards it from
    // play. If there is a War plot card revealed, return Shadow of the Isles to your hand instead
    // of placing it in your discard pile.
    setupCardAbilities() {
        this.action({
            title: 'Choose and discard locations',
            target: {
                choosingPlayer: 'each',
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'location' &&
                    !card.isLimited(),
                gameAction: 'discard',
                messages: Messages.eachPlayerTargetingForCardType('locations')
            },
            message:
                '{player} plays {source} to have each player choose and discard a non-limited location',
            gameAction: GameActions.simultaneously((context) => [
                ...context.targets.getTargets().map((card) => GameActions.discardCard({ card })),
                GameActions.ifCondition({
                    condition: (context) => context.game.anyPlotHasTrait('War'),
                    thenAction: GameActions.returnCardToHand((context) => ({
                        card: context.source
                    }))
                })
            ])
        });
    }
}

ShadowOfTheIsles.code = '13072';

export default ShadowOfTheIsles;
