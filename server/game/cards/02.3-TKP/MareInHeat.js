import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MareInHeat extends DrawCard {
    // Mare in Heat (02044)
    // Knight character only.
    // While attached character is attacking or defending alone, Mare in Heat gains: "Action: Kneel
    // Mare in Heat to choose a participating character with STR higher than that of attached
    // character, and remove that character from the challenge."
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Knight' });
        this.action({
            title: 'Remove character from challenge',
            condition: (context) =>
                context.game.isDuringChallenge({ attackingAlone: context.source.parent }) ||
                context.game.isDuringChallenge({ defendingAlone: context.source.parent }),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isParticipating() &&
                    card.getStrength() > context.source.parent.getStrength()
            },
            message: '{player} kneels {source} to remove {target} from the challenge',
            gameAction: GameActions.removeFromChallenge((context) => ({ card: context.target }))
        });
    }
}

MareInHeat.code = '02044';

export default MareInHeat;
