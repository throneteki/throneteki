import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Bribery extends DrawCard {
    // Bribery (17146)
    // Action: Choose and kneel a character with printed cost X or lower. Then, if there is no
    // attachment attached to that character and it has the Ally or Mercenary trait, you may take
    // control of it.
    setupCardAbilities() {
        this.xValue({
            min: (context) => context.source.getMinXValue(),
            max: () => 99
        });

        this.action({
            target: {
                cardCondition: (card, context) =>
                    card.isMatch({ location: 'play area', type: 'character', kneeled: false }) &&
                    (!context.xValue || card.getPrintedCost() <= context.xValue) &&
                    card.allowGameAction('kneel')
            },
            message: {
                format: '{player} plays {source} and pays {xValue} gold to kneel {target}',
                args: { xValue: (context) => context.xValue }
            },
            gameAction: GameActions.kneelCard((context) => ({ card: context.target })).then({
                condition: (context) =>
                    context.parentContext.target.isMatch({
                        trait: ['Ally', 'Mercenary'],
                        hasAttachments: false
                    }),
                gameAction: GameActions.may({
                    title: (context) => `Take control of ${context.parentContext.target.name}?`,
                    message: {
                        format: 'Then, {player} takes control of {card}',
                        args: { card: (context) => context.event.card }
                    },
                    gameAction: GameActions.takeControl((context) => ({
                        player: context.player,
                        card: context.parentContext.target
                    }))
                })
            })
        });
    }

    getMinXValue() {
        const characters = this.game.filterCardsInPlay((card) =>
            card.isMatch({ type: 'character', kneeled: false })
        );
        const costs = characters.map((card) => card.getPrintedCost());
        return Math.min(...costs);
    }
}

Bribery.code = '17146';

export default Bribery;
