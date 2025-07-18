export const Flags = Object.freeze({
    challengeOptions: Object.freeze({
        canBeDeclaredWhileKneeling: 'challengeOptions.canBeDeclaredWhileKneeling',
        canBeDeclaredWithoutIcon: 'challengeOptions.canBeDeclaredWithoutIcon',
        doesNotContributeStrength: 'challengeOptions.doesNotContributeStrength',
        doesNotKneelAsAttacker: function (challengeType) {
            return `challengeOptions.doesNotKneelAsAttacker.${challengeType}`;
        },
        doesNotKneelAsDefender: function (challengeType) {
            return `challengeOptions.doesNotKneelAsDefender.${challengeType}`;
        },
        ignoresAssaultLocationCost: 'challengeOptions.ignoresAssaultLocationCost',
        mustBeDeclaredAsAttacker: 'challengeOptions.mustBeDeclaredAsAttacker',
        mustBeDeclaredAsDefender: 'challengeOptions.mustBeDeclaredAsDefender'
    }),
    dominanceOptions: Object.freeze({
        contributesWhileKneeling: 'dominanceOptions.contributesWhileKneeling',
        doesNotContribute: 'dominanceOptions.doesNotContribute'
    }),
    player: Object.freeze({
        cannotBeFirstPlayer: 'player.cannotBeFirstPlayer',
        cannotGainChallengeBonus: 'player.cannotGainChallengeBonus',
        cannotGainDominancePower: 'player.cannotGainDominancePower',
        cannotRevealPlot: 'player.cannotRevealPlot',
        cannotWinChallenge: 'player.cannotWinChallenge',
        cannotWinGame: 'player.cannotWinGame',
        doesNotReturnUnspentGold: 'player.doesNotReturnUnspentGold'
    })
});
