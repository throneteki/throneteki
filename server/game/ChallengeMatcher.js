const Matcher = require('./Matcher');

class ChallengeMatcher {
    static isMatch(challenge, matchers) {
        return (
            Matcher.containsValue(matchers.initiatingPlayer, () => challenge.initiatingPlayer) &&
            Matcher.containsValue(matchers.initiatedChallengeType, () => challenge.initiatedChallengeType) &&
            Matcher.containsValue(matchers.challengeType, () => challenge.challengeType) &&
            Matcher.containsValue(matchers.attackingPlayer, () => challenge.attackingPlayer) &&
            Matcher.containsValue(matchers.defendingPlayer, () => challenge.defendingPlayer) &&
            Matcher.containsValue(matchers.initiated, () => challenge.isInitiated) &&
            Matcher.containsValue(matchers.initiatedAgainstPlayer, () => challenge.initiatedAgainstPlayer) &&
            Matcher.containsValue(matchers.loser, () => challenge.loser) &&
            Matcher.containsValue(matchers.winner, () => challenge.winner) &&
            //check for both attacking and declaredAsAttacker to make cards like The Knight work (having Stealth when attacking alone)
            Matcher.anyValue(matchers.attackingAlone, card => (card.isAttacking() || card.isDeclaredAsAttacker()) && challenge.attackers.length === 1) && 
            Matcher.anyValue(matchers.defendingAlone, card => card.isDefending() && challenge.defenders.length === 1) &&
            Matcher.containsValue(matchers.number, () => challenge.number) &&
            Matcher.containsValue(matchers.unopposed, () => challenge.isUnopposed()) &&
            Matcher.anyValue(matchers.by5, value => (challenge.strengthDifference >= 5) === value) &&
            Matcher.anyValue(matchers.match, func => func(challenge)) &&
            Matcher.anyValue(matchers.not, notProperties => !ChallengeMatcher.isMatch(challenge, notProperties)) &&
            Matcher.anyValue(matchers.or, orProperties => ChallengeMatcher.isMatch(challenge, orProperties))
        );
    }

    static isParticipatingAlone(value, participants) {
        return !value || participants.length === 1;
    }
}

module.exports = ChallengeMatcher;
