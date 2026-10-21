import DrawCard from '../../drawcard.js';
import KillTracker from '../../EventTrackers/KillTracker.js';

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
                    this.tracker.wasKilledThisPhase(card) &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} and kills {2} to put {3} into play',
                    context.player,
                    this,
                    context.costs.kill,
                    context.target
                );
                context.player.putIntoPlay(context.target);
            }
        });
    }
}

Glamor.code = '11088';

export default Glamor;
