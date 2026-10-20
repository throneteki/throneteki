import DrawCard from '../drawcard.js';
import GameActions from '../GameActions/index.js';

function reducerAbility(card, ability, { kind, matches }) {
    return {
        title: 'Kneel to reduce',
        clickToActivate: true,
        phase: 'marshal',
        cost: ability.costs.kneelSelf(),
        message: {
            format: '{player} kneels {source} to reduce the cost of the next {faction} {kind} they marshal this phase by {amount}',
            args: {
                faction: () => card.faction,
                kind: () => kind,
                amount: () => card.reduceBy
            }
        },
        gameAction: GameActions.lastingEffect((context) => ({
            duration: 'untilEndOfPhase',
            condition: () => !context.abilityDeactivated,
            targetController: 'current',
            effect: ability.effects.reduceNextMarshalledCardCost(card.reduceBy, matches)
        }))
    };
}

export class FactionCostReducer extends DrawCard {
    constructor(owner, cardData, reduceBy, faction) {
        super(owner, cardData);

        this.reduceBy = reduceBy;
        this.faction = faction;
    }

    setupCardAbilities(ability) {
        this.action(
            reducerAbility(this, ability, {
                kind: 'card',
                matches: (card) => card.isFaction(this.faction)
            })
        );
    }
}

export class FactionCharacterCostReducer extends DrawCard {
    constructor(owner, cardData, reduceBy, faction) {
        super(owner, cardData);

        this.reduceBy = reduceBy;
        this.faction = faction;
    }

    setupCardAbilities(ability) {
        this.action(
            reducerAbility(this, ability, {
                kind: 'character',
                matches: (card) => card.getType() === 'character' && card.isFaction(this.faction)
            })
        );
    }
}
