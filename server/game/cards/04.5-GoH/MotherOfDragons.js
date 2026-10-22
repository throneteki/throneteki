import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MotherOfDragons extends DrawCard {
    // Mother of Dragons (04094)
    // Stormborn character you control only.
    // Challenges Action: During a challenge in which you control a participating Dragon character,
    // kneel Mother of Dragons to have attached character participate in the challenge on your side.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Stormborn' });
        this.action({
            title: 'Add attached character to the challenge',
            condition: (context) =>
                context.player.anyCardsInPlay(
                    (card) => card.isParticipating() && card.hasTrait('Dragon')
                ),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to have {parent} participate in the challenge on their side',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.source.parent,
                player: context.player
            }))
        });
    }
}

MotherOfDragons.code = '04094';

export default MotherOfDragons;
