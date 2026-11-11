import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RaidingLongship extends DrawCard {
    // Raiding Longship (02032)
    // Challenges Action: If you are the first player, kneel Raiding Longship to choose a defending
    // character without attachments. That character does not contribute its STR to this challenge.
    setupCardAbilities(ability) {
        this.action({
            title: "Remove character's STR from challenge",
            condition: (context) => context.source.controller.firstPlayer,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isDefending() &&
                    card.attachments.length === 0
            },
            message: "{player} kneels {source} to remove {target}'s STR from the challenge",
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.doesNotContributeStrength()
            }))
        });
    }
}

RaidingLongship.code = '02032';

export default RaidingLongship;
