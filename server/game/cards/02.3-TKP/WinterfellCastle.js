import DrawCard from '../../drawcard.js';

function hasParticipatingUniqueStarks(source) {
    let challenge = source.game.currentChallenge;
    return (
        challenge &&
        ['military', 'power'].includes(challenge.challengeType) &&
        challenge.getNumberOfParticipants((card) => isUniqueStark(source, card)) >= 2
    );
}

function isUniqueStark(source, card) {
    return (
        card.controller === source.controller &&
        card.getType() === 'character' &&
        card.isUnique() &&
        card.isFaction('stark')
    );
}

class WinterfellCastle extends DrawCard {
    // Winterfell Castle (02022)
    // During a [military] or [power] challenge in which you control 2 or more unique participating
    // [stark] characters, each of those characters gets +2 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => hasParticipatingUniqueStarks(context.source),
            match: (card, context) => isUniqueStark(context.source, card) && card.isParticipating(),
            effect: ability.effects.modifyStrength(2)
        });
    }
}

WinterfellCastle.code = '02022';

export default WinterfellCastle;
