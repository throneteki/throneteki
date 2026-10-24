import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheShadowTower extends DrawCard {
    // The Shadow Tower (03034)
    // Reaction: After you win a challenge as the defending player, kneel The Shadow Tower to choose
    // a character controlled by the losing opponent. That character cannot be declared as an
    // attacker this phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.defendingPlayer === context.source.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.game.currentChallenge.loser
            },
            message:
                '{player} kneels {source} to make {target} unable to be declared as attacker this phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.cannotBeDeclaredAsAttacker()
            }))
        });
    }
}

TheShadowTower.code = '03034';

export default TheShadowTower;
