import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WillasTyrell extends DrawCard {
    // Willas Tyrell (09008)
    // Action: Kneel Willas Tyrell. Then, if you control:
    // - Margaery Tyrell, stand her.
    // - The Knight of Flowers, he gains insight until the end of the phase.
    // - Ser Garlan Tyrell, he gains renown until the end of the phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Willas and stand/give keywords',
            message: '{player} uses {source} to kneel {source}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.source })).then({
                gameAction: GameActions.simultaneously([
                    GameActions.ifCondition({
                        condition: (context) => !!findCard(context, 'Margaery Tyrell')?.kneeled,
                        thenAction: {
                            message: {
                                format: 'Then {player} stands {margaery}',
                                args: {
                                    margaery: (context) => findCard(context, 'Margaery Tyrell')
                                }
                            },
                            gameAction: GameActions.standCard((context) => ({
                                card: findCard(context, 'Margaery Tyrell')
                            }))
                        }
                    }),
                    ...[
                        ['The Knight of Flowers', 'insight'],
                        ['Ser Garlan Tyrell', 'renown']
                    ].map(([name, keyword]) =>
                        GameActions.ifCondition({
                            condition: (context) => !!findCard(context, name),
                            thenAction: {
                                message: {
                                    format: 'Then {player} gives {keyword} to {character} until the end of the phase',
                                    args: {
                                        keyword: () => keyword,
                                        character: (context) => findCard(context, name)
                                    }
                                },
                                gameAction: GameActions.lastingEffect((context) => ({
                                    duration: 'untilEndOfPhase',
                                    match: findCard(context, name),
                                    effect: ability.effects.addKeyword(keyword)
                                }))
                            }
                        })
                    )
                ])
            })
        });
    }
}

function findCard(context, name) {
    return context.player.cardsInPlay.find((card) => card.name === name);
}

WillasTyrell.code = '09008';

export default WillasTyrell;
