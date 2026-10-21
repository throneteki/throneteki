import DrawCard from '../../drawcard.js';

class DrownedGodFanatic extends DrawCard {
    // Drowned God Fanatic (17106)
    // Action: Kill a [greyjoy] character you own and control to put Drowned God Fanatic into play
    // from your dead pile. (Max once per round.)
    // Interrupt: When the effects of an opponent's triggered character ability would initiate,
    // discard Drowned God Fanatic from your hand to cancel those effects.
    setupCardAbilities(ability) {
        this.action({
            max: ability.limit.perRound(1),
            title: 'Put Drowned God Fanatic into play',
            condition: () => this.controller.canPutIntoPlay(this),
            location: 'dead pile',
            cost: ability.costs.kill(
                (card) =>
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    card.owner === this.controller &&
                    card.isFaction('greyjoy')
            ),
            handler: (context) => {
                context.player.putIntoPlay(this);
                this.game.addMessage(
                    '{0} kills {1} to put {2} into play from their dead pile',
                    context.player,
                    context.costs.kill,
                    this
                );
            }
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    event.source.controller !== this.controller
            },
            location: 'hand',
            cost: ability.costs.discardSelfFromHand(),
            handler: (context) => {
                context.event.cancel();
                this.game.addMessage(
                    '{0} discards {1} from their hand to cancel {2}',
                    context.player,
                    this,
                    context.event.source
                );
            }
        });
    }
}

DrownedGodFanatic.code = '17106';

export default DrownedGodFanatic;
