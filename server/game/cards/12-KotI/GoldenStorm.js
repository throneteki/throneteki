import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GoldenStorm extends DrawCard {
    // Golden Storm (12018)
    // Reaction: After you win a [military] challenge as the attacking player, kneel Golden Storm to
    // choose and kill a participating character. Then, if you control a participating Raider
    // character, stand Golden Storm.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.attackingPlayer === context.player
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating(),
                gameAction: 'kill'
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target })).then({
                gameAction: GameActions.ifCondition({
                    condition: (context) =>
                        context.player.anyCardsInPlay(
                            (card) =>
                                card.hasTrait('Raider') &&
                                card.getType() === 'character' &&
                                card.isParticipating()
                        ),
                    thenAction: {
                        message: 'Then {player} stands {source}',
                        gameAction: GameActions.standCard((context) => ({ card: context.source }))
                    }
                })
            })
        });
    }
}

GoldenStorm.code = '12018';

export default GoldenStorm;
