import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Bribery extends DrawCard {
    // Bribery (15045)
    // Action: Choose and kneel a character with printed cost X or lower. If that character has the
    // Ally or Mercenary trait, you may take control of it instead.
    setupCardAbilities() {
        this.xValue({
            min: (context) => context.source.getMinXValue(),
            max: () => 99
        });

        this.action({
            target: {
                cardCondition: (card, context) =>
                    card.isMatch({ location: 'play area', type: 'character' }) &&
                    (!context.xValue || card.getPrintedCost() <= context.xValue) &&
                    ((card.isMatch({ kneeled: false }) && card.allowGameAction('kneel')) ||
                        (card.isMatch({ trait: ['Ally', 'Mercenary'] }) &&
                            card.allowGameAction('takeControl')))
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => !context.target.isMatch({ trait: ['Ally', 'Mercenary'] }),
                thenAction: {
                    message: '{player} plays {source} to kneel {target}',
                    gameAction: GameActions.kneelCard((context) => ({
                        card: context.target
                    }))
                },
                elseAction: GameActions.choose({
                    title: (context) => `Take control of ${context.target.name} instead?`,
                    choices: {
                        'Take control': {
                            message: '{player} plays {source} to take control of {target}',
                            gameAction: GameActions.takeControl((context) => ({
                                player: context.player,
                                card: context.target
                            }))
                        },
                        Kneel: {
                            message: '{player} plays {source} to kneel {target}',
                            gameAction: GameActions.kneelCard((context) => ({
                                card: context.target
                            }))
                        }
                    }
                })
            })
        });
    }

    getMinXValue() {
        const characters = this.game.filterCardsInPlay(
            (card) =>
                card.isMatch({ type: 'character', kneeled: false }) ||
                card.isMatch({ type: 'character', trait: ['Ally', 'Mercenary'] })
        );
        const costs = characters.map((card) => card.getPrintedCost());
        return Math.min(...costs);
    }
}

Bribery.code = '15045';

export default Bribery;
