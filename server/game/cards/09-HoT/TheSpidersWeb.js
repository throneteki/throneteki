import PlotCard from '../../plotcard.js';

class TheSpidersWeb extends PlotCard {
    // The Spider's Web (09049)
    // Reaction: After claim is applied for an [intrigue] challenge you won, you may initiate an
    // additional [intrigue] challenge this phase. Until the end of the phase, raise the claim value
    // on your revealed plot card by 1 during [intrigue] challenges. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            limit: ability.limit.perPhase(1),
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.player === this.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            handler: () => {
                this.game.addMessage(
                    '{0} uses {1} to be able to initiate an additional {2} challenge with claim raised by 1',
                    this.controller,
                    this,
                    'intrigue'
                );
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge('intrigue')
                }));
                this.untilEndOfPhase((ability) => ({
                    condition: () => this.game.isDuringChallenge({ challengeType: 'intrigue' }),
                    match: (card) => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }
}

TheSpidersWeb.code = '09049';

export default TheSpidersWeb;
