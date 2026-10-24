import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ThorosOfMyr extends DrawCard {
    // Thoros of Myr (08037)
    // Renown.
    // Interrupt: When another non-loyal character you control would be killed, kneel Thoros of Myr
    // and discard 1 power from him to save that character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    event.card !== context.source &&
                    !event.card.isLoyal() &&
                    event.card.controller === context.source.controller &&
                    event.card.canBeSaved()
            },
            cost: [ability.costs.kneelSelf(), ability.costs.discardPowerFromSelf(1)],
            message: {
                format: '{player} kneels and discards 1 power from {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

ThorosOfMyr.code = '08037';

export default ThorosOfMyr;
