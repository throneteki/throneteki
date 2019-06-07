const Flags = {
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
