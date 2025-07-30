export const Flags = Object.freeze({
    blanks: Object.freeze({
        excludingTraits: 'blanks.excludingTraits',
        full: 'blanks.full'
    }),
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
    losesAspect: Object.freeze({
        allFactions: 'losesAspect.allFactions',
        faction: function (factionName) {
            return `losesAspect.factions.${factionName}`;
        },
        keywords: 'losesAspect.keywords',
        immunity: 'loseAspect.immunity',
        traits: 'losesAspect.traits'
    }),
    player: Object.freeze({
        cannotBeFirstPlayer: 'player.cannotBeFirstPlayer',
        cannotGainChallengeBonus: 'player.cannotGainChallengeBonus',
        cannotGainDominancePower: 'player.cannotGainDominancePower',
        cannotRevealPlot: 'player.cannotRevealPlot',
        cannotWinChallenge: 'player.cannotWinChallenge',
        cannotWinGame: 'player.cannotWinGame',
        doesNotReturnUnspentGold: 'player.doesNotReturnUnspentGold'
    }),
    plotModifiers: Object.freeze({
        cannotProvide: function (modifier) {
            return `plotModifiers.cannotProvide.${modifier}`;
        }
    }),
    powerOptions: Object.freeze({
        doesNotContribute: 'powerOptions.doesNotContribute'
    })
});
