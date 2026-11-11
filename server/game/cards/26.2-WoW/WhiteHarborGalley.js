import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhiteHarborGalley extends DrawCard {
    // White Harbor Galley (26032)
    // Shadow (1).
    // While you are the attacking or defending player, each participating character gets +1 STR.
    // Reaction: After White Harbor Galley comes out of shadows during a challenge in which you
    // control a participating character, kneel a character you control to have it participate in
    // the challenge on your side.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    or: [
                        { attackingPlayer: context.source.controller },
                        { defendingPlayer: context.source.controller }
                    ]
                }),
            match: (card) => card.isParticipating(),
            targetController: 'any',
            effect: ability.effects.modifyStrength(1)
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card === context.source &&
                    context.source.controller.anyCardsInPlay({
                        type: 'character',
                        participating: true
                    })
            },
            cost: ability.costs.kneel(
                (card) => card.getType() === 'character' && card.canParticipateInChallenge()
            ),
            message:
                '{player} uses {source} and kneels {costs.kneel} to have it participate in the challenge on their side',
            gameAction: GameActions.addToChallenge((context) => ({ card: context.costs.kneel }))
        });
    }
}

WhiteHarborGalley.code = '26032';

export default WhiteHarborGalley;
