const ChallengeKeywordsWindow = require('./ChallengeKeywordsWindow');
const GameKeywords = require('../gamekeywords.js');

const initiatingKeywords = ['stealth', 'assault'];

class InitiatingKeywordsWindow extends ChallengeKeywordsWindow {
    constructor(game, challenge) {
        super(game, challenge);
        this.attackingCardsWithContext = this.buildContexts(
            challenge.declaredAttackers,
            this.challenge.attackingPlayer
        );
    }

    continue() {
        for (let keyword of initiatingKeywords) {
            let ability = GameKeywords[keyword];
            let attackersWithKeyword = this.attackingCardsWithContext.filter((attacker) =>
                ability.canResolve(attacker.context)
            );

            if (attackersWithKeyword.length > 0) {
                this.resolveAbility(ability, attackersWithKeyword);
            }
        }

        return true;
    }
}

module.exports = InitiatingKeywordsWindow;
