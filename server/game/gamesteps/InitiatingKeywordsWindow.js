const {sortBy} = require('../../Array');

const AbilityContext = require('../AbilityContext.js');
const BaseStep = require('./basestep.js');
const GameKeywords = require('../gamekeywords.js');

const initiatingKeywords = ['stealth', 'assault'];

class InitiatingKeywordsWindow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.attackingCardsWithContext = challenge.declaredAttackers.map(card => {
            return { card: card, context: new AbilityContext({ player: this.challenge.attackingPlayer, game: this.game, challenge: this.challenge, source: card }) };
        });
        this.resolvedAbilities = [];
    }

    continue() {
        for(let keyword of initiatingKeywords) {
            let ability = GameKeywords[keyword];
            let attackersWithKeyword = this.attackingCardsWithContext.filter(attacker => attacker.card.hasKeyword(keyword));

            if(keyword === 'assault') {
                let sorted = sortBy(attackersWithKeyword, attacker => attacker.card.getPrintedCost()).reverse();
                this.resolveAbility(ability, sorted);
            } else {
                this.resolveAbility(ability, attackersWithKeyword);
            }
        }

        return true;
    }

    resolveAbility(ability, participants) {
        for(let participant of participants) {
            this.game.queueSimpleStep(() => {
                participant.context.resolved = this.resolvedAbilities.filter(resolved => resolved.ability.title === ability.title);
                if(!ability.canResolve(participant.context)) {
                    return;
                }

                this.game.resolveAbility(ability, participant.context);
                this.resolvedAbilities.push({ ability, context: participant.context });
            });
        }
    }
}

module.exports = InitiatingKeywordsWindow;
