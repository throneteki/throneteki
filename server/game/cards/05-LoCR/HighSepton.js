import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HighSepton extends DrawCard {
    // High Septon (05039)
    // Interrupt: When an opponent chooses a character you control as the only target of a triggered
    // ability, choose an eligible The Seven character you control to become the target of that
    // triggered ability instead. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.interrupt({
            limit: ability.limit.perPhase(1),
            when: {
                onTargetsChosen: (event, context) =>
                    event.ability.isTriggeredAbility() &&
                    event.targets.hasSingleTarget() &&
                    event.targets.anySelection(
                        (selection) =>
                            selection.choosingPlayer !== context.player &&
                            selection.value.getType() === 'character' &&
                            selection.value.controller === context.player
                    )
            },
            target: {
                cardCondition: (card, context) =>
                    context.event.targets.selections[0].isEligible(card) &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    card.hasTrait('The Seven')
            },
            message: {
                format: '{player} uses {source} to choose {target} as the target for {ability} instead',
                args: { ability: (context) => context.event.ability.card }
            },
            gameAction: GameActions.changeAbilityTarget((context) => ({
                selection: context.event.targets.selections[0],
                card: context.target
            }))
        });
    }
}

HighSepton.code = '05039';

export default HighSepton;
