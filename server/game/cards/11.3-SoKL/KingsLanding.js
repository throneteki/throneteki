const DrawCard = require('../../drawcard.js');

class KingsLanding extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardMarshalled', 'onPhaseEnded']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.hasMarshalledThisPhase,
            targetController: 'current',
            effect: ability.effects.canMarshal(card => card.controller === this.controller && card.location === 'discard pile' && card.getType() === 'location')
        });

        this.action({
            title: 'Draw 1 card',
            phase: 'challenge',
            condition: () => this.controller.canDraw(),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardFromHand(card => card.getType() === 'location')
            ],
            handler: context => {
                context.player.drawCardsToHand(1);
                this.game.addMessage('{0} kneels {1} and discards {2} from their hand to draw 1 card',
                    context.player, this, context.costs.discardFromHand);
            }
        });
    }

    onCardMarshalled(event) {
        if(event.player === this.controller && event.originalController === this.controller && event.originalLocation === 'discard pile' && event.card.getType() === 'location') {
            this.hasMarshalledThisPhase = true;
            // Explicitly recalculate effects to ensure that the persistent
            // effect's condition is checked immediately and thus disabled.
            this.game.postEventCalculations();
        }
    }

    onPhaseEnded() {
        this.hasMarshalledThisPhase = false;
    }
}

KingsLanding.code = '11058';

module.exports = KingsLanding;
