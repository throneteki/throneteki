const Flags = {
    card: {
        cannotProvidePlotModifier: function(modifier) {
            return `card.cannotProvidePlotModifier.${modifier}`;
        },
        challenges: {
            canBeDeclaredWhileKneeling: 'card.challenges.canBeDeclaredWhileKneeling',
            canBeDeclaredWithoutIcon: 'card.challenges.canBeDeclaredWithoutIcon',
            doesNotContributeStrength: 'card.challenges.doesNotContributeStrength',
            doesNotKneelAsAttacker: function(challengeType = 'any') {
                return `card.challenges.doesNotKneelAsAttacker.${challengeType}`;
            },
            doesNotKneelAsDefender: function(challengeType = 'any') {
                return `card.challenges.doesNotKneelAsDefender.${challengeType}`;
            },
            mustBeDeclaredAsAttacker: 'card.challenges.mustBeDeclaredAsAttacker',
            mustBeDeclaredAsDefender: 'card.challenges.mustBeDeclaredAsDefender'
        },
        entersPlayKneeled: 'card.entersPlayKneeled',
        isBurning: 'card.isBurning',
        loseAspect: {
            faction: function(faction) {
                return `card.loseAspect.faction.${faction.toLowerCase()}`;
            },
            factions: 'card.loseAspect.factions',
            keywords: 'card.loseAspect.keywords',
            traits: 'card.loseAspect.traits'
        },
        optionalStandDuringStanding: 'card.optionalStandDuringStanding'
    },
    player: {
        cannotGainChallengeBonus: 'player.cannotGainChallengeBonus',
        cannotRevealPlot: 'player.cannotRevealPlot',
        cannotWinChallenge: 'player.cannotWinChallenge',
        cannotWinGame: 'player.cannotWinGame',
        doesNotReturnUnspentGold: 'player.doesNotReturnUnspentGold',
        revealTopCard: 'player.revealTopCard'
    }
};

module.exports = Flags;
