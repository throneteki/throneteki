const ChallengeKeywordsWindow = require('./ChallengeKeywordsWindow');
const AbilityContext = require('../AbilityContext.js');
const GameKeywords = require('../gamekeywords.js');

const initiatingKeywords = ['stealth', 'assault'];

class InitiatingKeywordsWindow extends ChallengeKeywordsWindow {
    constructor(game, challenge) {
        super(game, challenge);
        this.attackingCardsWithContext = challenge.declaredAttackers.map(card => {
            return { card: card, context: new AbilityContext({ player: this.challenge.attackingPlayer, game: this.game, challenge: this.challenge, source: card }) };
        });
    }

    continue() {
        for(let keyword of initiatingKeywords) {
            let ability = GameKeywords[keyword];
            let attackersWithKeyword = this.attackingCardsWithContext.filter(attacker => attacker.card.hasKeyword(keyword));

            if(attackersWithKeyword.length > 0) {
                this.resolveAbility(ability, attackersWithKeyword);
            }
        }

        return true;
    }
}

module.exports = InitiatingKeywordsWindow;
