const DrawCard = require('../../drawcard');
const {ChallengeTracker} = require('../../EventTrackers');

class TheEyrie extends DrawCard {
    setupCardAbilities(ability) {
        this.challengeTracker = ChallengeTracker.forPhase(this.game);

        this.plotModifiers({
            initiative: -2,
            reserve: 1
        });

        this.persistentEffect({
            condition: () => this.controller.getTotalInitiative() === 0 && this.game.isDuringChallenge({ initiated: true }),
            targetController: 'any',
            match: card => card.getType() === 'character' && !card.isParticipating(),
            effect: ability.effects.modifyStrength(2)
        });

        this.action({
            title: 'Contribute STR to challenge',
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            condition: () => this.game.isDuringChallenge(),
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: false, // TODO: Remove this once contributeSTR properly prevents a participating character also contributing (adding STR twice)
                    controller: 'current'
                }
            },
            message: {
                format: '{player} uses {source} and kneels their faction card to have {target} contribute its STR (currently {STR}) to {player}\'s this challenge',
                args: { STR: context => context.target.getStrength() }
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    // Force the effect to recalculate mid-challenge in case the character STR changes
                    condition: () => true,
                    targetController: 'current',
                    effect: ability.effects.contributeChallengeStrength(() => context.target.getStrength())
                }));
            }
        });
    }
}

TheEyrie.code = '23031';

module.exports = TheEyrie;
