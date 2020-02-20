const Flags = {
    challenges: {
        canBeDeclaredWhileKneeling: 'challenges.canBeDeclaredWhileKneeling',
        canBeDeclaredWithoutIcon: 'challenges.canBeDeclaredWithoutIcon',
        doesNotContributeStrength: 'challenges.doesNotContributeStrength',
        doesNotKneelAsAttacker: function(challengeType = 'any') {
            return `challenges.doesNotKneelAsAttacker.${challengeType}`;
        },
        doesNotKneelAsDefender: function(challengeType = 'any') {
            return `challenges.doesNotKneelAsDefender.${challengeType}`;
        },
        mustBeDeclaredAsAttacker: 'mustBeDeclaredAsAttacker',
        mustBeDeclaredAsDefender: 'mustBeDeclaredAsDefender'
    },
    loseAspect: {
        faction: function(faction) {
            return `loseAspect.faction.${faction.toLowerCase()}`;
        },
        factions: 'loseAspect.factions',
        keywords: 'loseAspect.keywords',
        traits: 'loseAspect.traits'
    },
    state: {
        cannotProvidePlotModifier: function(modifier) {
            return `state.cannotProvidePlotModifier.${modifier}`;
        },
        entersPlayKneeled: 'state.entersPlayKneeled',
        isBurning: 'state.isBurning',
        optionalStandDuringStanding: 'state.optionalStandDuringStanding'
    }
};

module.exports = Flags;
