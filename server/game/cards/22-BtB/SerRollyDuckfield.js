import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SerRollyDuckfield extends DrawCard {
    // Ser Rolly Duckfield (22019)
    // While you control Aegon Targaryen, he gains a [military] icon.
    // Interrupt: When a King or Lord character would be killed, discard 1 card from your hand to
    // save it. (Limit once per round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Aegon Targaryen',
            effect: ability.effects.addIcon('military')
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    (event.card.hasTrait('Lord') || event.card.hasTrait('King'))
            },
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perRound(1),
            message: {
                format: '{player} uses {source} and discards {costs.discardFromHand} from their hand to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

SerRollyDuckfield.code = '22019';

export default SerRollyDuckfield;
