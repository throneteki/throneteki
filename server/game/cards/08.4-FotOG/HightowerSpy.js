import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HightowerSpy extends DrawCard {
    // Hightower Spy (08063)
    // Ambush (3).
    // Reaction: After Hightower Spy enters play, choose a character and reveal the top card of your
    // deck. Until the end of the phase, that character gets +X STR. X is the printed cost of the
    // revealed card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message:
                '{player} uses {source} to choose {target} and reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                gameAction: GameActions.ifCondition({
                    condition: (context) => context.event.cards[0].hasPrintedCost(),
                    thenAction: {
                        message: {
                            format: '{player} gives {character} +{strength} STR until the end of the phase',
                            args: {
                                character: (context) => context.parentContext.target,
                                strength: (context) => context.event.cards[0].getPrintedCost()
                            }
                        },
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.parentContext.target,
                            effect: ability.effects.modifyStrength(
                                context.event.cards[0].getPrintedCost()
                            )
                        }))
                    }
                })
            })
        });
    }
}

HightowerSpy.code = '08063';

export default HightowerSpy;
