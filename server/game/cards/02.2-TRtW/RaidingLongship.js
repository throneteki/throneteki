import DrawCard from '../../drawcard.js';

class RaidingLongship extends DrawCard {
    // Raiding Longship (02032)
    // Challenges Action: If you are the first player, kneel Raiding Longship to choose a defending
    // character without attachments. That character does not contribute its STR to this challenge.
    setupCardAbilities(ability) {
        this.action({
            title: "Remove character's STR from challenge",
            condition: () => this.controller.firstPlayer,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isDefending() &&
                    card.attachments.length === 0
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.doesNotContributeStrength()
                }));

                this.game.addMessage(
                    "{0} kneels {1} to remove {2}'s STR from the challenge",
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

RaidingLongship.code = '02032';

export default RaidingLongship;
