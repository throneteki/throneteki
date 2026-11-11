import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Rhaegal extends DrawCard {
    // Rhaegal (15003)
    // No attachments.
    // Reaction: After you win a challenge in which Rhaegal is attacking, choose and stand another
    // character you control. Then, if that character has the Dragon or Stormborn trait, stand
    // Rhaegal. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.player === event.challenge.winner &&
                    event.challenge.isAttacking(context.source)
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.kneeled &&
                    card.controller === context.player &&
                    card !== context.source,
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.standCard((context) => ({ card: context.target })).then({
                gameAction: GameActions.ifCondition({
                    condition: (context) =>
                        context.parentContext.target.hasTrait('Dragon') ||
                        context.parentContext.target.hasTrait('Stormborn'),
                    thenAction: {
                        message: 'Then {player} stands {source}',
                        gameAction: GameActions.standCard((context) => ({ card: context.source }))
                    }
                })
            })
        });
    }
}

Rhaegal.code = '15003';

export default Rhaegal;
