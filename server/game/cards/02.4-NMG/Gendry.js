import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Gendry extends DrawCard {
    // Gendry (02068)
    // Reaction: After you win dominance, Gendry gains 1 power.
    // Forced Reaction: After an opponent wins dominance, you may discard 1 power from Gendry. If
    // you do not, sacrifice a Bastard character.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) => context.player === event.winner
            },
            message: '{player} uses {source} to gain power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
        this.forcedReaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    event.winner && context.player !== event.winner
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.source.power >= 1,
                thenAction: GameActions.choose({
                    title: (context) => `Discard a power from ${context.source.name}?`,
                    choices: {
                        Yes: {
                            message: '{player} is forced to discard a power from {source}',
                            gameAction: GameActions.discardPower((context) => ({
                                card: context.source,
                                amount: 1
                            }))
                        },
                        No: sacrificeBastard()
                    }
                }),
                elseAction: sacrificeBastard()
            })
        });
    }
}

function sacrificeBastard() {
    return {
        message: '{player} is forced by {source} to sacrifice a Bastard character',
        gameAction: GameActions.chooseCards({
            title: 'Select a Bastard character',
            cardCondition: (card, context) =>
                card.location === 'play area' &&
                card.hasTrait('Bastard') &&
                card.getType() === 'character' &&
                card.controller === context.player,
            gameAction: (card) => GameActions.sacrificeCard({ card })
        })
    };
}

Gendry.code = '02068';

export default Gendry;
