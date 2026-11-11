import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RobertBaratheon extends DrawCard {
    // Robert Baratheon (14001)
    // Renown.
    // Reaction: After the standing phase begins (choose one):
    // - other characters with printed cost 5 or higher cannot stand this phase.
    // - characters with printed cost 4 or lower cannot stand this phase.
    // - locations cannot stand this phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'standing'
            },
            choices: {
                'Printed Cost 5+': cannotStand(
                    ability,
                    (card, context) =>
                        card.getType() === 'character' &&
                        card.getPrintedCost() >= 5 &&
                        card !== context.source
                ),
                'Printed Cost 4-': cannotStand(
                    ability,
                    (card) => card.getType() === 'character' && card.getPrintedCost() <= 4
                ),
                Locations: cannotStand(ability, (card) => card.getType() === 'location')
            }
        });
    }
}

function cannotStand(ability, condition) {
    return {
        message: {
            format: '{player} uses {source} to prevent {cards} from standing this phase',
            args: { cards: (context) => affectedCards(context, condition) }
        },
        gameAction: GameActions.lastingEffect((context) => ({
            duration: 'untilEndOfPhase',
            match: affectedCards(context, condition),
            targetController: 'any',
            effect: ability.effects.cannotBeStood()
        }))
    };
}

function affectedCards(context, condition) {
    return context.game.filterCardsInPlay((card) => condition(card, context));
}

RobertBaratheon.code = '14001';

export default RobertBaratheon;
