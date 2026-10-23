import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreyWind extends DrawCard {
    // Grey Wind (21018)
    // Unique [stark] character only.
    // Attached character gains stealth.
    // Interrupt: When the effects of a triggered character ability would initiate, return a
    // Direwolf card to your hand to cancel those effects. (Limit once per phase.)
    // Action: Pay 1 gold to attach Grey Wind to a different character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', unique: true });
        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });
        this.interrupt({
            canCancel: true,
            when: {
                //Restrict triggering on own character abilities to forced triggered abilities
                onCardAbilityInitiated: (event, context) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    (event.ability.isForcedAbility() || event.source.controller !== context.player)
            },
            cost: ability.costs.returnToHand((card) => card.hasTrait('Direwolf')),
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} and returns {costs.returnToHand} to their hand to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
        this.action({
            title: 'Attach Greywind to another character',
            cost: ability.costs.payGold(1),
            target: {
                type: 'select',
                cardCondition: { location: 'play area', type: 'character' }
            },
            limit: ability.limit.perPhase(1),
            message: '{player} pays 1 gold to attach {source} to {target}',
            gameAction: GameActions.attach((context) => ({
                attachment: context.source,
                target: context.target
            }))
        });
    }
}

GreyWind.code = '21018';

export default GreyWind;
