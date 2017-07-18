const _ = require('underscore');

const BaseStep = require('./basestep.js');
const GameKeywords = require('../gamekeywords.js');

const challengeKeywords = ['insight', 'intimidate', 'pillage', 'renown'];

class KeywordWindow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.winnerCards = challenge.getWinnerCards();
    }

    continue() {
        let appliedIntimidate = false;

        _.each(this.winnerCards, card => {
            let context = { game: this.game, challenge: this.challenge, source: card };

            _.each(challengeKeywords, keyword => {
                // It is necessary to check whether intimidate has been applied
                // here instead of in the ability class because the individual
                // keywords are resolved asynchronously but are queued up
                // synchronously here. So two intimidates could be queued when
                // only one is allowed.
                if(keyword === 'intimidate' && appliedIntimidate) {
                    return;
                }

                let ability = GameKeywords[keyword];
                if(card.hasKeyword(keyword) && ability.meetsRequirements(context)) {
                    appliedIntimidate = appliedIntimidate || (keyword === 'intimidate');
                    this.game.resolveAbility(ability, context);
                }
            });

            this.game.checkWinCondition(this.challenge.winner);
        });

        return true;
    }
}

module.exports = KeywordWindow;
