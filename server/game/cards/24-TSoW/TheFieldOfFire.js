const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheFieldOfFire extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: { trait: 'Dragon', type: 'character', controller: 'current', location: 'play area' }
            },
            message: {
                format: '{player} plays {source} to choose {target} and give each character with printed STR {lowerSTR} or lower -1 STR until the end of the phase.',
                args: { lowerSTR: context => context.target.getPrintedStrength() - 1 }
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.genericHandler(context => {
                            this.untilEndOfPhase(ability => ({
                                match: card => card.getType() === 'character' && card.getPrintedStrength() < context.target.getPrintedStrength(),
                                targetController: 'any',
                                effect: ability.effects.modifyStrength(-1)
                            }));
                        }),
                        GameActions.genericHandler(() => {
                            this.untilEndOfPhase(ability => ({
                                match: card => card.getType() === 'character' && card.hasTrait('Army'),
                                targetController: 'any',
                                effect: ability.effects.burn
                            }));
                        })
                    ])
                    , context);
            }
        });
    }
}

TheFieldOfFire.code = '24021';

module.exports = TheFieldOfFire;
