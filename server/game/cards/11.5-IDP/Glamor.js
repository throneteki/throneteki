const DrawCard = require('../../drawcard');

class Glamor extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new KillTracker(this.game);
    }

    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });

        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.action({
            title: 'Resurrect character',
            cost: ability.costs.killParent(),
            target: {
                cardCondition: (card, context) => (
                    card.controller === context.player &&
                    card.location === 'dead pile' &&
                    this.tracker.wasKilledThisPhase(card) &&
                    context.player.canPutIntoPlay(card)
                )
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} and kills {2} to put {3} into play',
                    context.player, this, context.costs.kill, context.target);
                context.player.putIntoPlay(context.target);
            }
        });
    }
}

class KillTracker {
    constructor(game) {
        this.killedThisPhase = [];
        game.on('onCharacterKilled', event => this.killedThisPhase.push(event.card));
        game.on('onPhaseStarted', () => this.killedThisPhase = []);
    }

    wasKilledThisPhase(card) {
        return this.killedThisPhase.includes(card);
    }
}

Glamor.code = '11088';

module.exports = Glamor;
