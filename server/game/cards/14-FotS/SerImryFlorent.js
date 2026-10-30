import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerImryFlorent extends DrawCard {
    // Ser Imry Florent (14011)
    // Action: Kill Ser Imry Florent to choose an opponent. You may sacrifice any number of
    // locations. For each location sacrificed this way, that opponent must choose and kneel a
    // standing character he or she controls.
    setupCardAbilities(ability) {
        this.action({
            title: 'Force kneel',
            cost: ability.costs.killSelf(),
            chooseOpponent: (opponent) =>
                opponent.anyCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        !card.kneeled &&
                        card.allowGameAction('kneel')
                ),
            target: {
                type: 'select',
                mode: 'unlimited',
                activePromptTitle: 'Select any number of locations',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.controller === context.player,
                gameAction: 'sacrifice'
            },
            message: '{player} kills {source} to sacrifice {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.sacrificeCard({ card }))
            ).then({
                message: {
                    format: 'Then {opponent} must kneel a standing character for each location sacrificed',
                    args: { opponent: (context) => context.parentContext.opponent }
                },
                gameAction: GameActions.chooseCards({
                    player: (context) => context.parentContext.opponent,
                    mode: 'exactly',
                    numCards: (context) => context.parentContext.target.length,
                    title: 'Select characters to kneel',
                    cardCondition: (card, context) =>
                        card.getType() === 'character' &&
                        !card.kneeled &&
                        card.location === 'play area' &&
                        card.controller === context.choosingPlayer,
                    gameAction: (card) => GameActions.kneelCard({ card })
                })
            })
        });
    }
}

SerImryFlorent.code = '14011';

export default SerImryFlorent;
