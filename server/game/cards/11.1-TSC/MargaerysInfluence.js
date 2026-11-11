import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MargaerysInfluence extends DrawCard {
    // Margaery's Influence (11005)
    // Terminal.
    // Action: While attached character is participating in a challenge, kneel Margaery's Influence
    // and pay 1 gold to stand attached character and remove it from the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand parent and remove from challenge',
            condition: (context) =>
                context.source.parent && context.source.parent.isParticipating(),
            cost: [ability.costs.kneelSelf(), ability.costs.payGold(1)],
            message: {
                format: '{player} kneels {source} and pays 1 gold to stand {parent} and remove it from the challenge',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.source.parent })),
                GameActions.removeFromChallenge((context) => ({ card: context.source.parent }))
            ])
        });
    }
}

MargaerysInfluence.code = '11005';

export default MargaerysInfluence;
