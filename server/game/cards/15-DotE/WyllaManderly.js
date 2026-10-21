import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WyllaManderly extends DrawCard {
    // Wylla Manderly (15035)
    // Reaction: After a character you control is sacrificed or killed, choose another card in your
    // discard pile and place it on the bottom of your deck. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.cardStateWhenKilled.controller === this.controller,
                onSacrificed: (event) =>
                    event.cardStateWhenSacrificed.controller === this.controller &&
                    event.cardStateWhenSacrificed.getType() === 'character'
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === this.controller &&
                    card !== context.event.card
            },
            message: '{player} uses {source} to place {target} on the bottom of their deck',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToDeck((context) => ({
                        card: context.target,
                        bottom: true
                    })),
                    context
                );
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

WyllaManderly.code = '15035';

export default WyllaManderly;
