import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SerVardisEgen extends DrawCard {
    // Ser Vardis Egen (23026)
    // Reaction: After you lose a challenge in which Ser Vardis Egen is defending, sacrifice him to
    // choose an attacking character. Place it in shadows with a shadow token on it (cannot be
    // saved). While that card is in shadows, it gains shadow (X). X is its printed cost.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.isDefending() && event.challenge.loser === context.player
            },
            cost: ability.costs.sacrificeSelf(),
            target: { cardCondition: { type: 'character', attacking: true } },
            message: '{player} sacrifices {source} to put {target} into shadows',
            gameAction: GameActions.putIntoShadows((context) => ({
                card: context.target,
                allowSave: false
            })).then((context, event) => {
                const card = event.card;
                const shadowCost = card.translateXValue(card.getPrintedCost());
                return {
                    gameAction: GameActions.simultaneously([
                        GameActions.placeToken({ card, token: Tokens.shadow }),
                        GameActions.lastingEffect(() => ({
                            duration: 'custom',
                            until: {
                                onCardMoved: (event) =>
                                    event.card === card && event.originalLocation === 'shadows'
                            },
                            match: card,
                            targetLocation: 'shadows',
                            effect: ability.effects.addKeyword(`Shadow (${shadowCost})`)
                        }))
                    ])
                };
            })
        });
    }
}

SerVardisEgen.code = '23026';

export default SerVardisEgen;
