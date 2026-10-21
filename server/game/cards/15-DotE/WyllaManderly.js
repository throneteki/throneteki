import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WyllaManderly extends DrawCard {
    // Wylla Manderly (15035)
    // Reaction: After a character you control is sacrificed or killed, choose another card in your
    // discard pile and place it on the bottom of your deck. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    event.cardStateWhenKilled.controller === context.source.controller,
                onSacrificed: (event, context) =>
                    event.cardStateWhenSacrificed.controller === context.source.controller &&
                    event.cardStateWhenSacrificed.getType() === 'character'
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.source.controller &&
                    card !== context.event.card
            },
            message: '{player} uses {source} to place {target} on the bottom of their deck',
            gameAction: GameActions.returnCardToDeck((context) => ({
                card: context.target,
                bottom: true
            })),
            limit: ability.limit.perPhase(1)
        });
    }
}

WyllaManderly.code = '15035';

export default WyllaManderly;
