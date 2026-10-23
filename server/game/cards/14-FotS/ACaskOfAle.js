import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ACaskOfAle extends DrawCard {
    // "A Cask of Ale" (14023)
    // Reaction: After you win a [power] challenge, choose 2 cards controlled by the same player.
    // Move up to 2 power from one of those cards to the other.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({ winner: context.player, challengeType: 'power' })
            },
            targets: {
                from: {
                    activePromptTitle: 'Select card with power',
                    cardCondition: (card) => hasPowerLocation(card) && card.getPower() > 0,
                    cardType: PowerCardTypes,
                    gameAction: 'movePower'
                },
                to: {
                    activePromptTitle: 'Select card to move power to',
                    cardCondition: (card, context) =>
                        hasPowerLocation(card) &&
                        card !== context.targets.from &&
                        (!context.targets.from ||
                            card.controller === context.targets.from.controller),
                    cardType: PowerCardTypes
                }
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.targets.from.power > 1,
                thenAction: GameActions.choose({
                    title: 'Choose amount of power',
                    choices: { 2: movePower(2), 1: movePower(1) }
                }),
                elseAction: movePower(1)
            })
        });
    }
}

const PowerCardTypes = ['attachment', 'character', 'faction', 'location', 'plot'];

function hasPowerLocation(card) {
    return ['active plot', 'faction', 'play area'].includes(card.location);
}

function movePower(amount) {
    return {
        message: {
            format: '{player} plays {source} to move {amount} power from {from} to {to}',
            args: {
                amount: () => amount,
                from: (context) => context.targets.from,
                to: (context) => context.targets.to
            }
        },
        gameAction: GameActions.movePower((context) => ({
            from: context.targets.from,
            to: context.targets.to,
            amount
        }))
    };
}

ACaskOfAle.code = '14023';

export default ACaskOfAle;
