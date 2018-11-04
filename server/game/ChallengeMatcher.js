const Matcher = require('./Matcher');

class ChallengeMatcher {
    static isMatch(challenge, matchers) {
        return (
            Matcher.containsValue(matchers.challengeType, challenge.challengeType) &&
            Matcher.containsValue(matchers.attackingPlayer, challenge.attackingPlayer) &&
            Matcher.containsValue(matchers.defendingPlayer, challenge.defendingPlayer) &&
            Matcher.containsValue(matchers.loser, challenge.loser) &&
            Matcher.containsValue(matchers.winner, challenge.winner) &&
            Matcher.anyValue(matchers.attackingAlone, card => card.isAttacking() && challenge.attackers.length === 1) &&
            Matcher.anyValue(matchers.defendingAlone, card => card.isDefending() && challenge.defenders.length === 1) &&
            Matcher.containsValue(matchers.number, challenge.number) &&
            Matcher.containsValue(matchers.unopposed, challenge.isUnopposed()) &&
            Matcher.anyValue(matchers.match, func => func(challenge))
        );
    }

    static isParticipatingAlone(value, participants) {
        return !value || participants.length === 1;
    }
}

module.exports = ChallengeMatcher;
