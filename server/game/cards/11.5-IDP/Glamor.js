import DrawCard from '../../drawcard.js';
import KillTracker from '../../EventTrackers/KillTracker.js';
import GameActions from '../../GameActions/index.js';

class Glamor extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new KillTracker(this.game);
    }

    // Glamor (11088)
    // Character you control only. Shadow (2). Terminal.
    // Attached character gets +2 STR.
    // Action: Kill attached character to choose another character in your dead pile that was killed
    // this phase. Return the chosen character to play.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });

        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.action({
            title: 'Resurrect character',
            cost: ability.costs.killParent(),
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'dead pile' &&
                    card !== context.costs.kill &&
                    context.source.tracker.wasKilledThisPhase(card) &&
                    context.player.canPutIntoPlay(card)
            },
            message: '{player} uses {source} and kills {costs.kill} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

Glamor.code = '11088';

export default Glamor;
