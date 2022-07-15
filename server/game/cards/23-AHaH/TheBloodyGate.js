const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions/index.js');

class TheBloodyGate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                !this.kneeled &&
                this.game.isDuringChallenge({
                    defendingPlayer: this.controller,
                    match: challenge => challenge.defenders.some(defender => defender.hasTrait('House Arryn'))
                })
            ),
            targetController: 'any',
            match: card => card === this.game.currentChallenge.attackingPlayer.activePlot,
            effect: ability.effects.modifyClaim(-1)
        });

        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            message: '{player} is forced by {source} to choose whether to kneel {source}',
            choices: {
                'Kneel The Bloody Gate': context => {
                    this.game.addMessage('{0} chooses to kneel {1}', context.player, context.source);
                    this.game.resolveGameAction(
                        GameActions.kneelCard(context => ({
                            card: context.source
                        })),
                        context
                    );
                },
                'Disallow challenges': context => {
                    this.game.addMessage('{0} choose not to kneel {1}', context.player, context.source);
                    this.untilEndOfPhase(ability => ({
                        targetController: 'current',
                        effect: [
                            ability.effects.cannotInitiateChallengeType('military'),
                            ability.effects.cannotInitiateChallengeType('power')
                        ]
                    }));
                }
            }
        });
    }
}

TheBloodyGate.code = '23032';

module.exports = TheBloodyGate;
