import DrawCard from '../../drawcard.js';

class DragonstoneProselyte extends DrawCard {
    // Dragonstone Proselyte (27021)
    // Challenges Action: Kneel Dragonstone Proselyte to choose a character with STR 3 or lower.
    // Until the end of the round, that character cannot stand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent character from standing',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 3
            },
            message:
                '{player} kneels {costs.kneel} to prevent {target} from standing until the end of the round',
            handler: (context) => {
                this.untilEndOfRound((ability) => ({
                    match: context.target,
                    effect: ability.effects.cannotBeStood()
                }));
            }
        });
    }
}

DragonstoneProselyte.code = '27021';

export default DragonstoneProselyte;
