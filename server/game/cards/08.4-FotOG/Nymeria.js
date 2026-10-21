import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Nymeria extends DrawCard {
    // Nymeria (08061)
    // Intimidate. No attachments.
    // Action: During a challenge in which you control a participating [stark] character, kneel
    // Nymeria and any number of other Direwolf characters to have each of those characters
    // participate in the challenge on your side.
    setupCardAbilities(ability) {
        this.action({
            title: 'Add Direwolfs to challenge',
            condition: (context) =>
                context.player.anyCardsInPlay(
                    (card) => card.isParticipating() && card.isFaction('stark')
                ),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.kneelAny(
                    (card, context) =>
                        card.hasTrait('Direwolf') &&
                        card.getType() === 'character' &&
                        card !== context.source,
                    true
                )
            ],
            message: {
                format: '{player} kneels {direwolves} to have them participate in the challenge on their side',
                args: { direwolves: (context) => this.direwolves(context) }
            },
            gameAction: GameActions.simultaneously((context) =>
                this.direwolves(context).map((card) =>
                    GameActions.addToChallenge({ card, player: context.player })
                )
            )
        });
    }

    direwolves(context) {
        return [
            context.source,
            ...context.getCostValuesFor('kneel').filter((card) => card !== context.source)
        ];
    }
}

Nymeria.code = '08061';

export default Nymeria;
