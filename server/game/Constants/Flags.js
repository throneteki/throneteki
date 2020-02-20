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
    }
};

module.exports = Flags;
