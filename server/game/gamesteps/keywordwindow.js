const _ = require('underscore');

const BaseStep = require('./basestep.js');
const GameKeywords = require('../gamekeywords.js');

const challengeKeywords = ['insight', 'intimidate', 'pillage', 'renown'];

class KeywordWindow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.winnerCardsWithContext = _.map(challenge.getWinnerCards(), card => {
            return { card: card, context: { game: this.game, challenge: this.challenge, source: card } };
        });
    }

    continue() {
        if(!this.challenge.winner) {
            return;
        }

        _.each(challengeKeywords, keyword => {
            this.applyKeyword(keyword);
        });

        return true;
    }

    applyKeyword(keyword) {
        let appliedIntimidate = false;
        let ability = GameKeywords[keyword];
        _.each(this.winnerCardsWithContext, participant => {
            let {card, context} = participant;

            // It is necessary to check whether intimidate has been applied
            // here instead of in the ability class because the individual
            // keywords are resolved asynchronously but are queued up
            // synchronously here. So two intimidates could be queued when
            // only one is allowed.
            if(keyword === 'intimidate' && appliedIntimidate) {
                return;
            }

            if(card.hasKeyword(keyword) && ability.meetsRequirements(context)) {
                appliedIntimidate = appliedIntimidate || (keyword === 'intimidate');
                this.game.resolveAbility(ability, context);
            }
        });

        this.game.checkWinCondition(this.challenge.winner);
    }
}

module.exports = KeywordWindow;
